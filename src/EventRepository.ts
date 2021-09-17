import _ from 'lodash';
import {LoggerContext} from 'a24-logzio-winston';
import {FilterQuery, Model} from 'mongoose';
const {RuntimeError} = require('a24-node-error-utils');

export interface Event {
  type: any,
  aggregate_id: any,
  data: object,
  sequence_id: number
  correlation_id: string
  meta_data?: {
    user_id: string,
    client_id: string,
    context: {
      type: string
      id?: string
    }
  }
}

export interface EventMeta {
  user_id: string,
  client_id: string,
  context: {
    type: string
    id?: string
  }
}

/**
 * EventRepository
 *  Based on the new implementation details the service layer no longer exists.
 *  Should this be injected into the well defined aggregates rather?
 *  IE a mixin concept / parasitic inheritance / Based on interfaces?
 */
export class EventRepository {
  constructor(private store: Model<any>, private correlation_id: string, private eventMeta?: EventMeta) {
  }

  async leftFoldEvents(eventHandler: any, aggregateId: any, sequenceId: number = undefined): Promise<any> {
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

  async save(events: any): Promise<any[]> {
    const enrichedEvents = _.map(events, (event) => {
      event.correlation_id = this.correlation_id
      event.meta_data = this.eventMeta
      return event;
    });
    console.log(events, enrichedEvents)
    return this.store.insertMany(enrichedEvents);
  }
}