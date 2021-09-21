import {reduce, map} from 'lodash';
import {FilterQuery, Model} from 'mongoose';
import {GenericObjectInterface} from 'GenericObjectInterface';

export interface AggregateEventInterface {
  type: string;
  aggregate_id: GenericObjectInterface;
  data: GenericObjectInterface;
  sequence_id: number;
}

// Might be worth having a UserEventMeta and SystemEventMeta concept
export interface EventMetaInterface {
  user_id: string;
  client_id?: string;
  context?: {
    type: string;
    id?: string;
  };
}

interface EventInterface {
  type: string;
  aggregate_id: GenericObjectInterface;
  data: GenericObjectInterface;
  sequence_id: number;
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
/**
 * EventRepository
 *   Should the EventStore be passed in here?
 *   How would we handle snaphots? Pass a list of possible "stores"?
 *   How do we build snapshots in the background and use them when they are ready?
 */
export class EventRepository {
  constructor(private store: Model<any>, private correlation_id: string, private eventMeta?: EventMetaInterface) {}

  async leftFoldEvents(
    eventHandler: any,
    aggregateId: GenericObjectInterface,
    sequenceId: number = undefined
  ): Promise<BaseProjectionInterface> {
    const query: FilterQuery<GenericObjectInterface> = {aggregate_id: aggregateId};

    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    const events: EventInterface[] = await this.store.find(query).sort({sequence_id: 1}).lean();

    return reduce(events, (aggregate: any, event: EventInterface) => eventHandler[event.type](aggregate, event), {
      last_sequence_id: 0
    });
  }

  async save(events: AggregateEventInterface[]): Promise<any[]> {
    const enrichedEvents: EventInterface[] = map(events, (aggEvent) => ({
      ...aggEvent,
      correlation_id: this.correlation_id,
      meta_data: this.eventMeta
    }));

    return this.store.insertMany(enrichedEvents);
  }
}
