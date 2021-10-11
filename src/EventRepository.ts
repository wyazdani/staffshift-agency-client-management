import {reduce, map} from 'lodash';
import {FilterQuery} from 'mongoose';
import {AggregateIdType, EventStore, EventStoreDataType, EventStoreModelInterface} from './models/EventStore';
import {WriteProjectionInterface} from './WriteProjectionInterface';
import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

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
  data: EventStoreDataType;
  sequence_id: number;
}

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
    private eventMeta?: EventMetaInterface
  ) {}

  async leftFoldEvents<AggregateType extends BaseAggregateRecordInterface>(
    writeProjectionHandler: WriteProjectionInterface<AggregateType>,
    aggregateId: AggregateIdType,
    sequenceId: number = undefined
  ): Promise<BaseProjectionInterface> {
    const query: FilterQuery<EventStoreModelInterface> = {aggregate_id: aggregateId};

    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
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
   */
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    const enrichedEvents: (EventInterface & BaseEventInterface)[] = map(events, (aggEvent) => ({
      ...aggEvent,
      correlation_id: this.correlation_id,
      meta_data: this.eventMeta
    }));

    return this.store.insertMany(enrichedEvents);
  }
}
