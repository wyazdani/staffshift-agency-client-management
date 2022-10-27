import {PreconditionFailedError} from 'a24-node-error-utils';
import {BaseAggregateIdInterface} from 'BaseAggregateIdInterface';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {AggregateIdType} from '../models/EventStore';
import {EventRepository, EventInterface, EventPointInTimeType} from '../EventRepository';
import {AbstractAggregate} from './AbstractAggregate';
import {AggregateCommandInterface} from './types';

export abstract class AbstractRepository<
  T extends AbstractAggregate<BaseAggregateIdInterface, BaseAggregateRecordInterface>
> {
  protected constructor(protected eventRepository: EventRepository) {}

  /**
   * Persist agency related events into event store
   */
  async save(events: EventInterface[]): Promise<void> {
    return this.eventRepository.save(events);
  }

  /**
   * Build and returns an aggregate
   */
  abstract getAggregate(aggregateId: AggregateIdType, pointInTime?: EventPointInTimeType): Promise<T>;
  /**
   * Based on the passed in command, the appropriate aggregate will be returned
   */
  async getCommandAggregate(command: AggregateCommandInterface, pointInTime?: EventPointInTimeType): Promise<T> {
    const aggregate = await this.getAggregate(command.aggregateId, pointInTime);

    if (command.optimistic_lock !== undefined && aggregate.getLastSequenceId() !== command.optimistic_lock) {
      throw new PreconditionFailedError(
        `Expecting ${aggregate.getId()?.name}:${command.optimistic_lock} actual ${
          aggregate.getId()?.name
        }:${aggregate.getLastSequenceId()}`
      );
    }
    return aggregate;
  }
}
