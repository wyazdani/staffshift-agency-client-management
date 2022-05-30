import {BaseEventStoreDataInterface} from 'EventTypes';
import {EitherType} from 'Generics';
import {reduce, map} from 'lodash';
import {FilterQuery} from 'mongoose';
import {SequenceIdMismatch} from './errors/SequenceIdMismatch';
import {AggregateIdType, EventStore, EventStoreModelInterface} from './models/EventStore';
import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';

// Might be worth having a UserEventMeta and SystemEventMeta concept
export interface EventMetaInterface {
  user_id: string;
  client_id?: string;
  context?: {
    type: string;
    id?: string;
  };
}

export interface BaseEventInterface {
  correlation_id: string;
  meta_data: {
    user_id: string;
    client_id?: string;
    context?: {
      type: string;
      id?: string;
    };
  };
}

interface BaseProjectionInterface {
  last_sequence_id: number;
}

export interface EventInterface {
  type: string;
  aggregate_id: AggregateIdType;
  data: BaseEventStoreDataInterface;
  sequence_id: number;
}
export type EventSequenceType = {
  sequence_id: number;
};
export type EventCreatedAtType = {
  created_at: Date;
};

export type EventPointInTimeType = EitherType<EventSequenceType, EventCreatedAtType>;
/**
 * EventRepository
 *   Should the EventStore be passed in here?
 *   How would we handle snapshots? Pass a list of possible "stores"?
 *   How do we build snapshots in the background and use them when they are ready?
 */
export class EventRepository {
  constructor(
    private store: typeof EventStore,
    private correlation_id: string,
    private eventMeta?: EventMetaInterface,
    private causation_id?: string
  ) {}

  async leftFoldEvents<AggregateType extends BaseAggregateRecordInterface>(
    writeProjectionHandler: WriteProjectionInterface<AggregateType>,
    aggregateId: AggregateIdType,
    pointInTime?: EventPointInTimeType
  ): Promise<BaseProjectionInterface> {
    const query: FilterQuery<EventStoreModelInterface> = {aggregate_id: aggregateId};

    if (pointInTime && pointInTime.sequence_id) {
      query['sequence_id'] = {$lte: pointInTime.sequence_id};
    }

    if (pointInTime && pointInTime.created_at) {
      query['created_at'] = {$lte: pointInTime.created_at};
    }
    const events: EventStoreModelInterface[] = await this.store.find(query).sort({sequence_id: 1}).lean();

    return reduce<EventStoreModelInterface, BaseProjectionInterface>(
      events,
      (acc: AggregateType, event: EventStoreModelInterface) => writeProjectionHandler.execute(event.type, acc, event),
      {last_sequence_id: 0}
    );
  }

  /**
   * Persist events into event store collection
   * We use transaction feature in MongoDB to be sure it's going to be all or nothing
   * If we're only going to save one event, we don't use transaction since it consumes more resources from mongo
   */
  async save(events: EventInterface[]): Promise<void> {
    const enrichedEvents: (EventInterface & BaseEventInterface)[] = map(events, (aggEvent) => ({
      ...aggEvent,
      correlation_id: this.correlation_id,
      meta_data: this.eventMeta,
      ...(this.causation_id && {causation_id: this.causation_id})
    }));

    try {
      if (enrichedEvents.length === 0) {
        return;
      } else if (enrichedEvents.length === 1) {
        await this.store.create(enrichedEvents[0]);
      } else {
        const session = await this.store.startSession();

        try {
          await session.withTransaction(async () => {
            await this.store.insertMany(enrichedEvents, {session});
          });
        } finally {
          await session.endSession();
          // It will be executed even if operation throws error
        }
      }
    } catch (error) {
      if (error.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        /**
         * We only have two unique indexes on EventStore collection:
         * - _id
         * - compound index: aggregate id and sequence id
         * The odds of having duplicate _id is zero (unless we have a bug in code)
         * So we count 11000 as sequence id duplicate(other process wrote to EventStore in mean time)
         * if some day we have multiple unique indexes on the collection, we need to parse the error and see
         * is it sequence id related or not
         */
        throw new SequenceIdMismatch('There is already an event in event store with same aggregate id and sequence id');
      }
      throw error;
    }
  }
}
