import {Transform, TransformCallback, TransformOptions} from 'stream';
import {LoggerContext} from 'a24-logzio-winston';
import {CallbackError, FilterQuery, Model} from 'mongoose';
import {Events} from '../../../Events';

const events = [
  Events.AGENCY_CLIENT_LINKED, Events.AGENCY_CLIENT_UNLINKED
];

interface ProjectionTransformerOptions extends TransformOptions {
  eventstore: Model<any>,
  model: Model<any>,
  pipeline: string,
  logger: LoggerContext
}

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
export class AgencyClientsProjectionTransformer extends Transform {
  private readonly eventstore: Model<any>;
  private model: Model<any>;
  private pipeline: string;
  private logger: LoggerContext;

  constructor(opts: ProjectionTransformerOptions) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventstore = opts.eventstore;
    this.model = opts.model;
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
  }

  _transform(data: any, encoding: any, callback: TransformCallback) {
    if (!events.includes(data.event.type)) {
      return callback(null, data);
    }
    const event = data.event;
    const criteria: FilterQuery<any> = {
      agency_id: event.aggregate_id.agency_id,
      client_id: event.aggregate_id.client_id
    };
    if (event.data.organisation_id) {
      criteria.organisation_id = event.data.organisation_id;
    }
    if (event.data.site_id) {
      criteria.site_id = event.data.site_id;
    }
    if (Events.AGENCY_CLIENT_LINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: true
        },
        {upsert: true},
        (err: CallbackError) => {
          return callback(err, data);
        }
      );
    } else if (Events.AGENCY_CLIENT_UNLINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: false
        },
        {upsert: true},
        (err: CallbackError) => {
          return callback(err, data);
        }
      );
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}