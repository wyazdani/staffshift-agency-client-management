import {Transform, TransformCallback, TransformOptions} from 'stream';
import {Model} from 'mongoose';
import {LoggerContext} from 'a24-logzio-winston';
import {AgencyClientRepository} from '../../../AgencyClient/AgencyClientRepository';
import {EventsEnum} from '../../../Events';
import {GenericObjectInterface} from 'GenericObjectInterface';

const events = [
  EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED, EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED
];

interface ProjectionOptionsInterface extends TransformOptions {
  eventstore: Model<any>,
  model: Model<any>,
  pipeline: string,
  logger: typeof LoggerContext
}

/**
 * Convert a standard delta change stream event into an upsert structure that can be used
 */
export class AgencyClientEventLogProjection extends Transform {
  private readonly eventstore: Model<any>;
  private model: Model<any>;
  private pipeline: string;
  private logger: typeof LoggerContext;
  constructor(opts: ProjectionOptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventstore = opts.eventstore;
    this.model = opts.model;
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
  }

  _transform(data: GenericObjectInterface, encoding: BufferEncoding, callback: TransformCallback): void {
    if (!events.includes(data.event.type)) {
      return callback(null, data);
    }
    const event = data.event;
    const repository = new AgencyClientRepository(this.eventstore);
    repository.getAggregate(event.aggregate_id.agency_id, event.aggregate_id.client_id, event.sequence_id)
      .then((aggregate) => {
        const agencyClientEvent = new this.model({
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id,
          event_type: event.type,
          evented_at: event.created_at,
          snapshot: aggregate.getConsultants()
        });
        agencyClientEvent.save((err: Error) => {
          if (err) {
            return callback(err);
          }
          return callback(null, data);
        });
      }).catch((err) => callback(err));
    // Should we be adding something here since this is a possible "hanging" issue
  }
}