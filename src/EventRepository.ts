import _ from 'lodash';
import {FilterQuery, Model} from 'mongoose';

export interface AggregateEvent {
  type: string,
  aggregate_id: object,
  data: object,
  sequence_id: number
}

// Might be worth having a UserEventMeta and SystemEventMeta concept
export interface EventMeta {
  user_id: string,
  client_id?: string,
  context?: {
    type: string
    id?: string
  }
}


interface Event {
  type: string,
  aggregate_id: object,
  data: object,
  sequence_id: number
  correlation_id: string
  meta_data: {
    user_id: string,
    client_id?: string,
    context?: {
      type: string
      id?: string
    }
  }
}

/**
 * EventRepository
 *   Should the EventStore be passed in here?
 *   How would we handle snaphots? Pass a list of possible "stores"?
 *   How do we build snapshots in the background and use them when they are ready?
 */
export class EventRepository {
  constructor(private store: Model<any>, private correlation_id: string, private eventMeta?: EventMeta) {
  }

  async leftFoldEvents(eventHandler: any, aggregateId: object, sequenceId: number = undefined): Promise<any> {
    const query: FilterQuery<any> = {aggregate_id: aggregateId};
    if (sequenceId) {
      query['sequence_id'] = {$lte: sequenceId};
    }
    const events: Event[] = await this.store.find(query).sort({sequence_id: 1}).lean();
    return _.reduce(
      events,
      (aggregate: any, event: Event) => eventHandler[event.type](aggregate, event),
      {last_sequence_id: 0}
    );
  }

  async save(events: AggregateEvent[]): Promise<any[]> {
    const enrichedEvents: Event[] = _.map(events, (aggEvent) => {
      return {...aggEvent, correlation_id: this.correlation_id, meta_data: this.eventMeta};
    });
    return this.store.insertMany(enrichedEvents);
  }
}