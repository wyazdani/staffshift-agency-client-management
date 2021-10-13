import {Transform, TransformCallback, TransformOptions} from 'stream';
import {EventsEnum} from '../../../Events';
import {LoggerContext} from 'a24-logzio-winston';
import {EventRepository} from '../../../EventRepository';
import {EventHandlerFactory} from '../factories/EventHandlerFactory';
import {EventStoreChangeStreamFullDocumentInterface} from 'EventStoreChangeStreamFullDocumentInterface';

const events = [
  EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

interface OptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  logger: LoggerContext;
}

/**
 * Responsible for building agency client consultant projection by delegating each supported
 * event to the correct event handler
 */
export class AgencyClientConsultantProjectionTransformer extends Transform {
  private readonly eventRepository: EventRepository;
  private readonly logger: LoggerContext;
  constructor(opts: OptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventRepository = opts.eventRepository;
    this.logger = opts.logger;
  }

  _transform(
    data: EventStoreChangeStreamFullDocumentInterface,
    encoding: BufferEncoding,
    callback: TransformCallback
  ): void {
    const event = data.event;
    const eventType = event.type;

    if (!events.includes(eventType)) {
      this.logger.debug('Incoming event ignored', {eventType, event});
      return callback(null, data);
    }

    this.logger.debug('Processing the incoming event', {event});
    const eventHandler = EventHandlerFactory.getHandler(eventType, this.eventRepository, this.logger);

    eventHandler
      .handle(event)
      .then(() => callback(null, data))
      .catch((error: Error) => callback(error));
  }
}
