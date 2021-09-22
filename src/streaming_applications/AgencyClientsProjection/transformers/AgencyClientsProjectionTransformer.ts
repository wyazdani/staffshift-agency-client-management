import {Transform, TransformCallback, TransformOptions} from 'stream';
import {LoggerContext} from 'a24-logzio-winston';
import {CallbackError, FilterQuery, Model} from 'mongoose';
import {EventRepository} from '../../../EventRepository';
import {EventsEnum} from '../../../Events';
import {GenericObjectInterface} from 'GenericObjectInterface';

const events = [EventsEnum.AGENCY_CLIENT_LINKED, EventsEnum.AGENCY_CLIENT_UNLINKED, EventsEnum.AGENCY_CLIENT_SYNCED];

interface ProjectionTransformerOptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<any>;
  pipeline: string;
  logger: typeof LoggerContext;
}

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
export class AgencyClientsProjectionTransformer extends Transform {
  private readonly eventRepository: EventRepository;
  private model: Model<any>;
  private pipeline: string;
  private logger: typeof LoggerContext;

  constructor(opts: ProjectionTransformerOptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventRepository = opts.eventRepository;
    this.model = opts.model;
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
  }

  _transform(data: GenericObjectInterface, encoding: BufferEncoding, callback: TransformCallback): void {
    if (!events.includes(data.event.type)) {
      this.logger.debug('Incoming event ignored', {event: data.event.type});

      return callback(null, data);
    }
    this.logger.debug('Processing the incoming event', {event: data.event.type});
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
    if (EventsEnum.AGENCY_CLIENT_LINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: true
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    } else if (EventsEnum.AGENCY_CLIENT_UNLINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: false
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    } else if (EventsEnum.AGENCY_CLIENT_SYNCED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: event.data.linked
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}
