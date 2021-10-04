import {Transform, TransformCallback, TransformOptions} from 'stream';
import {LoggerContext} from 'a24-logzio-winston';
import {CallbackError, FilterQuery, Model} from 'mongoose';
import {EventRepository} from '../../../EventRepository';
import {EventsEnum} from '../../../Events';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {AgencyConsultantRolesProjectionDocumentType} from '../../../models/AgencyConsultantRolesProjection';

const events = [
  EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

interface ProjectionTransformerOptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<AgencyConsultantRolesProjectionDocumentType>;
  pipeline: string;
  logger: LoggerContext;
}

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
export class AgencyConsultantProjectionTransformer extends Transform {
  private readonly eventRepository: EventRepository;
  private model: Model<AgencyConsultantRolesProjectionDocumentType>;
  private pipeline: string;
  private logger: LoggerContext;

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

    const criteria: FilterQuery<AgencyConsultantRolesProjectionDocumentType> = {
      agency_id: event.aggregate_id.agency_id
    };

    if (event.data._id) {
      criteria._id = event.data._id;
    }

    switch (data.event.type) {
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED:
        this.addRecord(this.logger, this.model, data, callback);
        break;
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED:
        this.updateRecord(this.logger, this.model, criteria, {status: 'enabled'}, data, callback);
        break;
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED:
        this.updateRecord(this.logger, this.model, criteria, {status: 'disabled'}, data, callback);
        break;
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED:
        this.updateRecord(this.logger, this.model, criteria, event.data, data, callback);
        break;
      default:
        //This is never expected, because we already do an initial check to allow only these 4 events
        return callback(new Error(`Unsupported event ${data.event.type} in AgencyConsultantProjectionTransformer`));
    }
  }

  /**
   * Adds a new record to the projection collection
   *
   * @param logger - logger
   * @param model - The projection model
   * @param data - Data object the transformer received
   * @param callback - the callback
   */
  private addRecord(
    logger: LoggerContext,
    model: Model<AgencyConsultantRolesProjectionDocumentType>,
    data: GenericObjectInterface,
    callback: TransformCallback
  ): void {
    const consultantRoleProjection = new model({
      agency_id: data.event.aggregate_id.agency_id,
      name: data.event.data.name,
      description: data.event.data.description,
      max_consultants: data.event.data.max_consultants,
      _id: data.event.data._id
    });

    consultantRoleProjection.save((err: Error) => {
      if (err) {
        logger.error('Error saving a record to the consultant role projection', {
          model: consultantRoleProjection.toObject(),
          originalError: err
        });
        return callback(err);
      }

      return callback(null, data);
    });
  }

  /**
   * Updates an existing record in the projection collection
   *
   * @param logger - logger
   * @param model - The projection model
   * @param query - query to find record
   * @param updateObject - object to update with
   * @param data - Data object the transformer received
   * @param callback - the callback
   */
  private updateRecord(
    logger: LoggerContext,
    model: Model<AgencyConsultantRolesProjectionDocumentType>,
    query: FilterQuery<AgencyConsultantRolesProjectionDocumentType>,
    updateObject: GenericObjectInterface,
    data: GenericObjectInterface,
    callback: TransformCallback
  ): void {
    model.updateOne(query, {$set: updateObject}, {upsert: true}, (err: CallbackError) => {
      if (err) {
        logger.error('Error updating a record to the consultant role projection', {
          originalError: err,
          query,
          updateObject
        });
        return callback(err);
      }
      callback(null, data);
    });
  }
}
