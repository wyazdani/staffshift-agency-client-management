import {Transform, TransformCallback, TransformOptions} from 'stream';
import {LoggerContext} from 'a24-logzio-winston';
import {CallbackError, FilterQuery, Model} from 'mongoose';
import {EventRepository} from '../../../EventRepository';
import {EventsEnum} from '../../../Events';
import {AgencyClientsProjectionDocumentType} from '../../../models/AgencyClientsProjection';
import {EventStoreChangeStreamFullDocumentInterface} from 'EventStoreChangeStreamFullDocumentInterface';
import {
  AgencyClientSyncedEventStoreDataInterface,
  AgencyClientConsultantAssignedEventStoreDataInterface,
  AgencyClientConsultantUnassignedEventStoreDataInterface,
  AgencyClientLinkedEventStoreDataInterface,
  AgencyClientUnlinkedEventStoreDataInterface
} from 'EventStoreDataTypes';

const events = [EventsEnum.AGENCY_CLIENT_LINKED, EventsEnum.AGENCY_CLIENT_UNLINKED, EventsEnum.AGENCY_CLIENT_SYNCED];

type SupportedEventsDataType =
  | AgencyClientLinkedEventStoreDataInterface
  | AgencyClientConsultantAssignedEventStoreDataInterface
  | AgencyClientConsultantUnassignedEventStoreDataInterface
  | AgencyClientSyncedEventStoreDataInterface
  | AgencyClientUnlinkedEventStoreDataInterface;
interface ProjectionTransformerOptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<AgencyClientsProjectionDocumentType>;
  pipeline: string;
  logger: LoggerContext;
}

/**
 * Convert an event store entry into the Agency Client Read Projection
 */
export class AgencyClientsProjectionTransformer extends Transform {
  private readonly eventRepository: EventRepository;
  private model: Model<AgencyClientsProjectionDocumentType>;
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

  _transform(
    data: EventStoreChangeStreamFullDocumentInterface,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    if (!events.includes(data.event.type)) {
      this.logger.debug('Incoming event ignored', {event: data.event.type});

      return callback(null, data);
    }
    this.logger.debug('Processing the incoming event', {event: data.event.type});
    const event = data.event;
    const criteria: FilterQuery<AgencyClientsProjectionDocumentType> = {
      agency_id: event.aggregate_id.agency_id,
      client_id: event.aggregate_id.client_id
    };

    const eventData = event.data as SupportedEventsDataType;

    if (eventData.organisation_id) {
      criteria.organisation_id = eventData.organisation_id;
    }
    if (eventData.site_id) {
      criteria.site_id = eventData.site_id;
    }
    if (EventsEnum.AGENCY_CLIENT_LINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: eventData.client_type,
          linked: true
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    } else if (EventsEnum.AGENCY_CLIENT_UNLINKED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: eventData.client_type,
          linked: false
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    } else if (EventsEnum.AGENCY_CLIENT_SYNCED === data.event.type) {
      this.model.findOneAndUpdate(
        criteria,
        {
          client_type: eventData.client_type,
          linked: (event.data as AgencyClientSyncedEventStoreDataInterface).linked
        },
        {upsert: true},
        (err: CallbackError) => callback(err, data)
      );
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}