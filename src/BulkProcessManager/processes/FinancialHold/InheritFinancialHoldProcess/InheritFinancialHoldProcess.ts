import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError} from 'a24-node-error-utils';
import {AgencyClientApplyFinancialHoldInheritanceInitiatedEventStoreDataInterface} from 'EventTypes/AgencyClientApplyFinancialHoldInheritanceInitiatedEventInterface';
import {find, get} from 'lodash';
import {FinancialHoldRepository} from '../../../../aggregates/FinancialHold/FinancialHoldRepository';
import {OrganisationJobWriteProjectionHandler} from '../../../../aggregates/OrganisationJob/OrganisationJobWriteProjectionHandler';
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
import {CompleteInheritFinancialHoldCommandInterface} from '../../../../aggregates/OrganisationJob/types/CommandTypes';
import {EventRepository} from '../../../../EventRepository';
import {AgencyClientsProjectionV2} from '../../../../models/AgencyClientsProjectionV2';
import {EventStore} from '../../../../models/EventStore';
import {ProcessInterface} from '../../../types/ProcessInterface';
import {CommandBusHelper} from '../CommandBusHelper';
import {RetryableSetFinancialHold} from '../RetryableSetFinancialHold';
import {AgencyClientApplyFinancialHoldInitiatedEventStoreDataInterface} from 'EventTypes/AgencyClientApplyFinancialHoldInitiatedEventInterface';
import {NullTypeFormatter} from 'ts-json-schema-generator';

interface ApplyFinancialHoldProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}

/**
 * force inherit the client from the parent and then apply inherited financial hold on all it's children and it's grandchildren
 * some children might not inherit from parent, then we don't apply inherited financial hold on those
 */
export class InheritFinancialHoldProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    AgencyClientApplyFinancialHoldInheritanceInitiatedEventStoreDataInterface,
    OrganisationJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private commandBusHelper: CommandBusHelper;
  private processRepository: ClientInheritanceProcessRepository;
  private processAggregateId: ClientInheritanceProcessAggregateIdInterface;
  private agencyClientRepository: AgencyClientRepository;
  private retryableSetFinancialHold: RetryableSetFinancialHold;
  private processAggregate: ClientInheritanceProcessAggregate;
  private financialHoldRepository: FinancialHoldRepository;
  constructor(private logger: LoggerContext, private opts: ApplyFinancialHoldProcessOptsInterface) {}

  private initDependencies() {
    const eventRepository = new EventRepository(
      EventStore,
      this.initiateEvent.correlation_id,
      this.initiateEvent.meta_data,
      this.initiateEvent._id
    );

    this.commandBus = new CommandBus(eventRepository);
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
    this.retryableSetFinancialHold = new RetryableSetFinancialHold(
      this.opts.maxRetry,
      this.opts.retryDelay,
      this.logger,
      this.commandBusHelper
    );
    this.financialHoldRepository = new FinancialHoldRepository(
      eventRepository,
      new OrganisationJobWriteProjectionHandler()
    );
  }

  /**
   * Steps:
   * - We first check if the client is linked
   * - force apply inherited financial hold on the client
   * - if client type is organisation
   *   - break
   * - if client type is site
   *   - find all wards under that site
   *     - for loop on all wards
   *       - apply inherited financial hold on ward(without force)
   * - if client type is ward, do nothing
   */
  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      AgencyClientApplyFinancialHoldInitiatedEventStoreDataInterface,
      OrganisationJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.initDependencies();
    this.logger.info('Inherit Financial Hold background process started', {
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
      this.logger.info('inherit financial hold process already completed', {
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
    const parentFinancialHold = await this.getFinancialHoldInformation(agencyClient);
    const success =
      this.isProgressed(this.initiateEvent.data.client_id) ||
      (await this.retryableSetFinancialHold.setInheritedFinancialHold(
        this.initiateEvent.data.client_id,
        parentFinancialHold.financialHold, // parent financial hold can be null, which means on parent we don't have any financial hold configuration. we need to propagate the null to the children
        parentFinancialHold.note,
        true // we force it here since if it's not inherited, we make it inherited
      ));

    if (!success) {
      this.logger.info('was not able to inherit financial hold on the actual node. completing the process', {eventId});
      await this.commandBusHelper.completeProcess();
      return;
    }

    if (clientType === 'site') {
      await this.setFinancilaHoldOnAllWards(
        this.initiateEvent.data.client_id,
        parentFinancialHold.financialHold,
        parentFinancialHold.note
      );
    } else {
      this.logger.info('It was ward, so there are no children.');
    }
    await this.commandBusHelper.completeProcess();
    this.logger.info('Apply financial hold background process finished', {
      eventId
    });
  }

  /**
   * Completes the initiate process on organisation job aggregate
   */
  async complete(): Promise<void> {
    try {
      const command: CompleteInheritFinancialHoldCommandInterface = {
        aggregateId: this.initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD,
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
   * apply inherited financial hold on all wards under the site id
   */
  private async setFinancilaHoldOnAllWards(
    siteId: string,
    financialHold: boolean | null,
    financialHoldNote: string | null
  ): Promise<void> {
    const wards = await AgencyClientsProjectionV2.getAllLinkedWards(
      this.initiateEvent.aggregate_id.agency_id,
      this.initiateEvent.aggregate_id.organisation_id,
      siteId
    );

    for (const ward of wards) {
      if (!this.isProgressed(ward.client_id)) {
        if (
          await this.retryableSetFinancialHold.setInheritedFinancialHold(
            ward.client_id,
            financialHold,
            financialHoldNote,
            false // we set force to false, since if the ward is not inherited we don't want to apply financial hold
          )
        ) {
          this.logger.debug('Applied financial-hold on ward', {
            ward_id: ward.client_id
          });
        } else {
          this.logger.info(
            'not able to apply inherited financial hold on ward due to internal error or ward is not inherited',
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

  private async getFinancialHoldInformation(
    agencyClientAggregate: AgencyClientAggregate
  ): Promise<{financialHold: boolean | null; note: string | null}> {
    const parentId = agencyClientAggregate.getParentClientId();

    const parentFinancialHold = await this.financialHoldRepository.getAggregate({
      name: 'financial_hold',
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      client_id: parentId
    });

    return {
      financialHold: parentFinancialHold.getFinancialHold(),
      note: parentFinancialHold.getNote()
    };
  }
}
