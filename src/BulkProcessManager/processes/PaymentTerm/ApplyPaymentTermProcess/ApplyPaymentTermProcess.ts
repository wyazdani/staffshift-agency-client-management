import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError} from 'a24-node-error-utils';
import {AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface} from 'EventTypes';
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
import {CompleteApplyPaymentTermCommandInterface} from '../../../../aggregates/OrganisationJob/types/CommandTypes';
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
 * applies a pay term on a client and then applies inherited pay term on all it's children and it's grandchildren
 * some children might not inherit from parent, then we don't apply inherited payment term on those
 */
export class ApplyPaymentTermProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface,
    OrganisationJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private commandBusHelper: CommandBusHelper;
  private processRepository: ClientInheritanceProcessRepository;
  private processAggregateId: ClientInheritanceProcessAggregateIdInterface;
  private agencyClientRepository: AgencyClientRepository;
  private retryableApplyPaymentTerm: RetryableApplyPaymentTerm;
  private processAggregate: ClientInheritanceProcessAggregate;
  constructor(private logger: LoggerContext, private opts: ApplyPaymentTermProcessOptsInterface) {}

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
    this.retryableApplyPaymentTerm = new RetryableApplyPaymentTerm(
      this.opts.maxRetry,
      this.opts.retryDelay,
      this.logger,
      this.commandBusHelper
    );
  }

  /**
   * Steps:
   * - We first check if the client is linked
   * - apply pay term on the client
   * - if client type is organisation
   *   - find all sites under that organisation
   *     - have a for loop on all sites
   *       - apply inherited payment term on the site
   *       - find all wards under that site
   *         - for loop on all sites
   *           - apply inherited payment term on ward
   * - if client type is site
   *   - find all wards under that site
   *     - have a for loop on all wards
   *       - apply inherited payment term on ward
   * - if client type is ward, do nothing
   */
  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface,
      OrganisationJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.initDependencies();
    this.logger.info('Apply Payment Term background process started', {eventId});

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
      this.logger.info('apply payment term process already completed', {id: initiateEvent._id});
      return;
    }

    if (!agencyClient.isLinked()) {
      this.logger.info('the client was unlinked when the process started');
      await this.commandBusHelper.completeProcess();
      return;
    }
    const success =
      this.isProgressed(this.initiateEvent.data.client_id) ||
      (await this.retryableApplyPaymentTerm.applyPaymentTerm(
        this.initiateEvent.data.client_id,
        this.initiateEvent.data.term
      ));

    if (!success) {
      this.logger.info('was not able to apply pay term on the actual node. completing the process', {eventId});
      await this.commandBusHelper.completeProcess();
      return;
    }

    if (clientType === 'organisation') {
      const sites = await AgencyClientsProjectionV2.getAllLinkedSites(
        this.initiateEvent.aggregate_id.agency_id,
        this.initiateEvent.data.client_id
      );

      for (const site of sites) {
        const success =
          this.isProgressed(site.client_id) ||
          (await this.retryableApplyPaymentTerm.applyInheritedPaymentTerm(
            site.client_id,
            this.initiateEvent.data.term,
            false
          ));

        if (success) {
          await this.applyPaymentTermOnAllWards(site.client_id);
        } else {
          this.logger.info(
            'not able to apply inherited payment term on site due to internal error or site is not inherited',
            {site_id: site.client_id}
          );
        }
      }
    } else if (clientType === 'site') {
      await this.applyPaymentTermOnAllWards(this.initiateEvent.data.client_id);
    } else {
      this.logger.info('It was ward, so there are no children.');
    }
    await this.commandBusHelper.completeProcess();
    this.logger.info('Apply payment term background process finished', {eventId});
  }

  async complete(): Promise<void> {
    try {
      const command: CompleteApplyPaymentTermCommandInterface = {
        aggregateId: this.initiateEvent.aggregate_id,
        type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM,
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
      name: this.initiateEvent.aggregate_id.name,
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      client_id: clientId
    });
  }

  /**
   * apply inherited payment term on all wards under the site id
   */
  private async applyPaymentTermOnAllWards(siteId: string): Promise<void> {
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
            this.initiateEvent.data.term,
            false
          )
        ) {
          this.logger.debug('Applied payment-term on ward', {ward_id: ward.client_id});
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
    return !!find(this.processAggregate.getProgressedItems(), {client_id: clientId});
  }
}
