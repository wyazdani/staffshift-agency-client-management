import {LoggerContext} from 'a24-logzio-winston';
import {difference, size} from 'lodash';
import {CommandBus} from 'src/aggregates/CommandBus';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientAggregate} from '../../../aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../aggregates/AgencyClient/AgencyClientRepository';
import {AgencyClientWriteProjectionHandler} from '../../../aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {AgencyClientAggregateRecordInterface} from '../../../aggregates/AgencyClient/types';
import {ClientInheritanceProcessRepository} from '../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessWriteProjectionHandler} from '../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessWriteProjectionHandler';
import {ClientInheritanceProcessAggregateIdInterface} from '../../../aggregates/ClientInheritanceProcess/types';
import {ClientInheritanceProcessAggregateStatusEnum} from '../../../aggregates/ClientInheritanceProcess/types/ClientInheritanceProcessAggregateStatusEnum';
import {EventRepository} from '../../../EventRepository';
import {EventStore} from '../../../models/EventStore';
import {ProcessInterface} from '../../types/ProcessInterface';
import {CommandBusHelper} from './CommandBusHelper';

/**
 * @TODO: use the one waqar defined
 */
interface AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface {
  term: string;
  _id: string;
  client_id: string;
}
interface OrgJobAggregateIdInterface {
  name: string;
  agency_id: string;
  organisation_id: string;
}

interface ApplyPaymentTermProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}

/**
 * @TODO
 */
export class ApplyPaymentTermProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface,
    OrgJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private commandBusHelper: CommandBusHelper;
  private processRepository: ClientInheritanceProcessRepository;
  private processAggregateId: ClientInheritanceProcessAggregateIdInterface;
  private agencyClientRepository: AgencyClientRepository;
  constructor(private logger: LoggerContext, private opts: ApplyPaymentTermProcessOptsInterface) {}

  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      AgencyClientApplyPaymentTermInitiatedEventStoreDataInterface,
      OrgJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.initDependencies();
    this.logger.info('Apply Payment Term background process started', {eventId});

    const processAggregate = await this.processRepository.getAggregate(this.processAggregateId);
    const currentStatus = processAggregate.getCurrentStatus();

    if (currentStatus === ClientInheritanceProcessAggregateStatusEnum.NEW) {
      await this.commandBusHelper.startProcess(0); //@TODO: find in projections, remember to do +1 for actual node
    } else if (currentStatus === ClientInheritanceProcessAggregateStatusEnum.COMPLETED) {
      this.logger.info('apply payment term process already completed', {id: initiateEvent._id});
      return;
    }
    const progressedItems = processAggregate.getProgressedItems();

    if (size(progressedItems) === 0) {
      // It means we have not applied the pay term on the actual node
      await this.commandBusHelper.applyPaymentTerm(this.initiateEvent.data.client_id, this.initiateEvent.data.term); //@TODO: apply retry, if failed break the process?
      await this.commandBusHelper.succeedItem(this.initiateEvent.data.client_id);
    }

    const agencyClient = await this.getAgencyClient(this.initiateEvent.data.client_id);
    if (!agencyClient.isLinked()) {
      throw Error('oops');// @TODO: something is not right. maybe the client is unlinked in the mean time. i think we can fail item and complete the process
    }
    // @TODO: check type of client

    this.logger.info('Consultant Assign background process finished', {eventId});
  }

  async complete(): Promise<void> {
    //@TODO Complete the job on org aggregate
  }

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
  }

  private async getAgencyClient(clientId: string): Promise<AgencyClientAggregate> {
    return await this.agencyClientRepository.getAggregate({
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      client_id: clientId
    });
  }
}
