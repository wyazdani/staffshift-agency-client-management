import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError} from 'a24-node-error-utils';
import {AgencyClientApplyPaymentTermInheritanceInitiatedEventStoreDataInterface} from 'EventTypes';
import {find, get} from 'lodash';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyRepository} from '../../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientAggregate} from '../../../../aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../aggregates/AgencyClient/AgencyClientRepository';
import {AgencyClientWriteProjectionHandler} from '../../../../aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {ClientInheritanceProcessAggregate} from '../../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessRepository} from '../../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessWriteProjectionHandler} from '../../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessWriteProjectionHandler';
import {ClientInheritanceProcessAggregateIdInterface} from '../../../../aggregates/ClientInheritanceProcess/types';
import {ClientInheritanceProcessAggregateStatusEnum} from '../../../../aggregates/ClientInheritanceProcess/types/ClientInheritanceProcessAggregateStatusEnum';
import {CommandBus} from '../../../../aggregates/CommandBus';
import {
  OrganisationJobAggregateIdInterface,
  OrganisationJobCommandEnum
} from '../../../../aggregates/OrganisationJob/types';
import {CompleteInheritPaymentTermCommandInterface} from '../../../../aggregates/OrganisationJob/types/CommandTypes';
import {PaymentTermRepository} from '../../../../aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermWriteProjectionHandler} from '../../../../aggregates/PaymentTerm/PaymentTermWriteProjectionHandler';
import {EventRepository} from '../../../../EventRepository';
import {AgencyClientsProjectionV2} from '../../../../models/AgencyClientsProjectionV2';
import {EventStore} from '../../../../models/EventStore';
import {ProcessInterface} from '../../../types/ProcessInterface';
import {CommandBusHelper} from '../CommandBusHelper';
import {RetryableApplyPaymentTerm} from '../RetryableApplyPaymentTerm';

interface ApplyPaymentTermProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}

/**
 * force inherit the client from the parent and then apply inherited pay term on all it's children and it's grandchildren
 * some children might not inherit from parent, then we don't apply inherited payment term on those
 */
export class InheritPaymentTermProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    AgencyClientApplyPaymentTermInheritanceInitiatedEventStoreDataInterface,
    OrganisationJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private commandBusHelper: CommandBusHelper;
  private processRepository: ClientInheritanceProcessRepository;
  private processAggregateId: ClientInheritanceProcessAggregateIdInterface;
  private agencyClientRepository: AgencyClientRepository;
  private retryableApplyPaymentTerm: RetryableApplyPaymentTerm;
  private processAggregate: ClientInheritanceProcessAggregate;
  private paymentTermRepository: PaymentTermRepository;
  constructor(private logger: LoggerContext, private opts: ApplyPaymentTermProcessOptsInterface) {}

  private initDependencies() {
    const eventRepository = new EventRepository(
      EventStore,
      this.initiateEvent.correlation_id,
      this.initiateEvent.meta_data,
      this.initiateEvent._id
    );

    this.commandBus = new CommandBus(eventRepository, this.logger);
    this.commandBusHelper = new CommandBusHelper(
      this.commandBus,
      this.initiateEvent.aggregate_id.agency_id,
      this.initiateEvent.data._id
    );
    this.processRepository = new ClientInheritanceProcessRepository(
      eventRepository,
      new ClientInheritanceProcessWriteProjectionHandler()
    );
    this.processAggregateId = {
      name: 'client_inheritance_process',
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      job_id: this.initiateEvent.data._id
    };
    this.agencyClientRepository = new AgencyClientRepository(
      eventRepository,
      new AgencyClientWriteProjectionHandler(),
      new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler())
    );
    this.retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
      this.opts.maxRetry,
      this.opts.retryDelay,
      this.logger,
      this.commandBusHelper
    );
    this.paymentTermRepository = new PaymentTermRepository(eventRepository, new PaymentTermWriteProjectionHandler());
  }

  /**
   * Steps:
   * - We first check if the client is linked
   * - force apply inherited pay term on the client
   * - if client type is organisation
   *   - break
   * - if client type is site
   *   - find all wards under that site
   *     - for loop on all wards
   *       - apply inherited payment term on ward(without force)
   * - if client type is ward, do nothing
   */
  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      AgencyClientApplyPaymentTermInheritanceInitiatedEventStoreDataInterface,
      OrganisationJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.initDependencies();
    this.logger.info('Inherit Payment Term background process started', {
      eventId
    });

    this.processAggregate = await this.processRepository.getAggregate(this.processAggregateId);
    const agencyClient = await this.getAgencyClient(this.initiateEvent.data.client_id);

    const currentStatus = this.processAggregate.getCurrentStatus();
    const clientType = agencyClient.getClientType();

    if (currentStatus === ClientInheritanceProcessAggregateStatusEnum.NEW) {
      const estimatedCount = await AgencyClientsProjectionV2.getEstimatedDescendantCount(
        this.initiateEvent.aggregate_id.agency_id,
        this.initiateEvent.aggregate_id.organisation_id,
        this.initiateEvent.data.client_id,
        clientType
      );

      await this.commandBusHelper.startProcess(estimatedCount);
    } else if (currentStatus === ClientInheritanceProcessAggregateStatusEnum.COMPLETED) {
      this.logger.info('inherit payment term process already completed', {
        id: initiateEvent._id
      });
      return;
    }

    if (!agencyClient.isLinked()) {
      this.logger.info('the client was unlinked when the process started');
      await this.commandBusHelper.completeProcess();
      return;
    }
    if (clientType === 'organisation') {
      this.logger.error('Something is not right. we cant do inherit on org type');
      await this.commandBusHelper.completeProcess();
      return;
    }
    const parentPaymentTerm = await this.getParentPaymentTerm(agencyClient);
    const success =
      this.isProgressed(this.initiateEvent.data.client_id) ||
      (await this.retryableApplyPaymentTerm.applyInheritedPaymentTerm(
        this.initiateEvent.data.client_id,
        parentPaymentTerm, // parent payment term can be null, which means on parent we don't have any pay term configuration. we need to propagate the null to the children
        true // we force it here since if it's not inherited, we make it inherited
      ));

    if (!success) {
      this.logger.info('was not able to inherit pay term on the actual node. completing the process', {eventId});
      await this.commandBusHelper.completeProcess();
      return;
    }

    if (clientType === 'site') {
      await this.applyPaymentTermOnAllWards(this.initiateEvent.data.client_id, parentPaymentTerm);
    } else {
      this.logger.info('It was ward, so there are no children.');
    }
    await this.commandBusHelper.completeProcess();
    this.logger.info('Apply payment term background process finished', {
      eventId
    });
  }

  /**
   * Completes the initiate process on organisation job aggregate
   */
  async complete(): Promise<void> {
    try {
      const command: CompleteInheritPaymentTermCommandInterface = {
        aggregateId: this.initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_INHERIT_PAYMENT_TERM,
        data: {_id: this.initiateEvent.data._id}
      };

      await this.commandBus.execute(command);
    } catch (error) {
      if (error instanceof ValidationError && get(error, 'errors[0].code') === 'JOB_ALREADY_COMPLETED') {
        this.logger.info('the job on organisation job aggregate was already done');
        return;
      }
      throw error;
    }
  }

  private async getAgencyClient(clientId: string): Promise<AgencyClientAggregate> {
    return await this.agencyClientRepository.getAggregate({
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      client_id: clientId
    });
  }

  /**
   * apply inherited payment term on all wards under the site id
   */
  private async applyPaymentTermOnAllWards(siteId: string, paymentTerm: string | null): Promise<void> {
    const wards = await AgencyClientsProjectionV2.getAllLinkedWards(
      this.initiateEvent.aggregate_id.agency_id,
      this.initiateEvent.aggregate_id.organisation_id,
      siteId
    );

    for (const ward of wards) {
      if (!this.isProgressed(ward.client_id)) {
        if (
          await this.retryableApplyPaymentTerm.applyInheritedPaymentTerm(
            ward.client_id,
            paymentTerm,
            false // we set force to false, since if the ward is not inherited we don't want to apply payment term
          )
        ) {
          this.logger.debug('Applied payment-term on ward', {
            ward_id: ward.client_id
          });
        } else {
          this.logger.info(
            'not able to apply inherited payment term on ward due to internal error or ward is not inherited',
            {
              ward_id: ward.client_id
            }
          );
        }
      }
    }
  }

  /**
   * check if the client is already progressed inside the aggregate or no?
   */
  private isProgressed(clientId: string): boolean {
    return !!find(this.processAggregate.getProgressedItems(), {
      client_id: clientId
    });
  }

  private async getParentPaymentTerm(agencyClientAggregate: AgencyClientAggregate): Promise<string | null> {
    const parentId = agencyClientAggregate.getParentClientId();

    const parentPaymentTerm = await this.paymentTermRepository.getAggregate({
      name: 'payment_term',
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      client_id: parentId
    });

    return parentPaymentTerm.getPaymentTerm();
  }
}
