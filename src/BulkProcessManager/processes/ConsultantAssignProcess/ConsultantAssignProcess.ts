import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';
import {ConsultantJobAssignInitiatedEventStoreDataInterface} from 'EventTypes';
import {difference} from 'lodash';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {ConsultantJobProcessAggregateStatusEnum} from '../../../aggregates/ConsultantJobProcess/types/ConsultantJobProcessAggregateStatusEnum';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventRepository} from '../../../EventRepository';
import {EventStore} from '../../../models/EventStore';
import {EventStoreErrorEncoder} from '../../EventStoreErrorEncoder';
import {RetryService, RetryableError, NonRetryableError} from '../../RetryService';
import {ProcessInterface} from '../../types/ProcessInterface';
import {CommandBus} from '../../../aggregates/CommandBus';

import {ConsultantJobProcessAggregateIdInterface} from '../../../aggregates/ConsultantJobProcess/types';
import {ConsultantJobProcessRepository} from '../../../aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessWriteProjectionHandler} from '../../../aggregates/ConsultantJobProcess/ConsultantJobProcessWriteProjectionHandler';

interface ConsultantAssignProcessOptsInterface {
  maxRetry: number;
  retryDelay: number;
}

/**
 * It handles bulk consultant assign to client
 * It has a for loop to iterate through all clients. In each loop it
 * generates start/item_succeeded/item_failed/completed events on ConsultantJobProcess aggregate
 * also it assigns clients to consultant one by one
 * during each assignment business/internal errors might happen. we might do retry(based on error type),
 * otherwise mark it as failure and move on
 */
export class ConsultantAssignProcess implements ProcessInterface {
  private initiateEvent: EventStorePubSubModelInterface<
    ConsultantJobAssignInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  >;
  private commandBus: CommandBus;
  private consultantJobProcessCommandAggregateId: ConsultantJobProcessAggregateIdInterface;
  private consultantJobCommandAggregateId: ConsultantJobAggregateIdInterface;
  private consultantJobProcessRepository: ConsultantJobProcessRepository;
  constructor(private logger: LoggerContext, private opts: ConsultantAssignProcessOptsInterface) {}

  async execute(
    initiateEvent: EventStorePubSubModelInterface<
      ConsultantJobAssignInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ): Promise<void> {
    this.initiateEvent = initiateEvent;
    const eventId = initiateEvent._id;

    this.logger.info('Consultant Assign background process started', {eventId});
    const eventRepository = new EventRepository(
      EventStore,
      initiateEvent.correlation_id,
      initiateEvent.meta_data,
      eventId
    );

    this.commandBus = new CommandBus(eventRepository);
    this.consultantJobProcessRepository = new ConsultantJobProcessRepository(
      eventRepository,
      new ConsultantJobProcessWriteProjectionHandler()
    );
    this.consultantJobCommandAggregateId = {
      name: 'consultant_job',
      agency_id: this.initiateEvent.aggregate_id.agency_id
    };
    this.consultantJobProcessCommandAggregateId = {
      name: 'consultant_job_process',
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      job_id: initiateEvent.data._id
    };
    const jobProcessAggregate = await this.consultantJobProcessRepository.getAggregate(
      this.consultantJobProcessCommandAggregateId
    );
    const currentStatus = jobProcessAggregate.getCurrentStatus();

    if (currentStatus === ConsultantJobProcessAggregateStatusEnum.NEW) {
      await this.commandBus.startConsultantJobProcess(
        this.consultantJobProcessCommandAggregateId,
        this.initiateEvent.data.client_ids.length
      );
    } else if (currentStatus === ConsultantJobProcessAggregateStatusEnum.COMPLETED) {
      this.logger.info('Consultant Assignment process already completed', {id: initiateEvent._id});
      return;
    }
    const progressedItems = jobProcessAggregate.getProgressedItems();
    const clientIds = difference(
      initiateEvent.data.client_ids,
      progressedItems.map((item) => item.client_id)
    );

    for (const clientId of clientIds) {
      if (await this.assignClientWithRetry(clientId)) {
        this.logger.info(`Assigned client ${clientId} to consultant ${this.initiateEvent.data.consultant_id}`);
        await this.commandBus.succeedItemConsultantJobProcess(this.consultantJobProcessCommandAggregateId, {
          client_id: clientId
        });
      }
    }
    await this.commandBus.completeConsultantJobProcess(this.consultantJobProcessCommandAggregateId);
    this.logger.info('Consultant Assign background process finished', {eventId});
  }

  private async assignClientWithRetry(clientId: string): Promise<boolean> {
    const retryService = new RetryService(this.opts.maxRetry, this.opts.retryDelay);

    try {
      await retryService.exec(() => this.assignClient(clientId));
      return true;
    } catch (error) {
      await this.commandBus.failItemConsultantJobProcess(this.consultantJobProcessCommandAggregateId, {
        client_id: clientId,
        errors: EventStoreErrorEncoder.encodeArray(retryService.getErrors())
      });
      return false;
    }
  }

  /**
   * Assigning client to consultant and deciding to do retry or not
   */
  private async assignClient(clientId: string): Promise<void> {
    try {
      this.logger.debug('Assigning consultant to client', {
        clientId,
        consultantId: this.initiateEvent.data.consultant_id
      });
      await this.commandBus.addAgencyClientConsultant(
        {
          name: this.initiateEvent.aggregate_id.name,
          agency_id: this.initiateEvent.aggregate_id.agency_id,
          client_id: clientId
        },
        this.initiateEvent.data.consultant_role_id,
        this.initiateEvent.data.consultant_id
      );
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        // You might need to reload the aggregate for retry
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          initiateEvent: this.initiateEvent._id,
          clientId: clientId,
          error
        });
        throw new RetryableError(error);
      } else if (error instanceof ValidationError || error instanceof ResourceNotFoundError) {
        // non-retryable errors
        this.logger.debug('Assigning consultant to client was not possible due to business validation', error);
        throw new NonRetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during assigning consultant to client', error);
        throw new RetryableError(error);
      }
    }
  }

  async complete(): Promise<void> {
    await this.commandBus.completeAssignConsultant(this.consultantJobCommandAggregateId, this.initiateEvent.data._id);
  }
}
