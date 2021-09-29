import {Transform, TransformCallback, TransformOptions} from 'stream';
import {LoggerContext} from 'a24-logzio-winston';
import {CallbackError, FilterQuery, Model} from 'mongoose';
import {EventRepository} from '../../../EventRepository';
import {EventsEnum} from '../../../Events';
import {GenericObjectInterface} from 'GenericObjectInterface';

const events = [EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED, EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED, EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED, EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED];

interface ProjectionTransformerOptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<any>;
  pipeline: string;
  logger: typeof LoggerContext;
}

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
export class AgencyConsultantProjectionTransformer extends Transform {
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
      agency_id: event.aggregate_id.agency_id
    };

    if (event.data._id) {
      criteria._id = event.data._id;
    }
    if (EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED === data.event.type) {
      const consultantRoleProjection = new this.model({
        agency_id: event.aggregate_id.agency_id,
        name: event.data.name,
        description: event.data.description,
        max_consultants: event.data.max_consultants,
        _id: event.data._id
      });

      consultantRoleProjection.save((err: Error) => {
        if (err) {
          return callback(err);
        }

        return callback(null, data);
      });
    } else if (EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          status: 'enabled'
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    } else if (EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          status: 'disabled'
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    } else if (EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          agency_id: event.aggregate_id.agency_id,
          name: event.data.name,
          description: event.data.description,
          max_consultants: event.data.max_consultants
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    }
  }
}
