import {Transform, TransformCallback, TransformOptions} from 'stream';
import {EventsEnum} from '../../../Events';
import {LoggerContext} from 'a24-logzio-winston';
import {EventRepository} from '../../../EventRepository';
import {EventHandlerFactory} from '../factories/EventHandlerFactory';
import {callbackify} from 'util';
import {TransformChangeStreamDataInterface} from '../types/TransformChangeStreamDataInterface';

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
export class AgencyClientConsultantProjection extends Transform {
  private readonly eventRepository: EventRepository;
  private readonly logger: LoggerContext;
  constructor(opts: OptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventRepository = opts.eventRepository;
    this.logger = opts.logger;
  }

  _transform(data: TransformChangeStreamDataInterface, encoding: BufferEncoding, callback: TransformCallback): void {
    const event = data.event;
    const eventType = event.type;

    if (!events.includes(eventType)) {
      this.logger.debug('Incoming event ignored', {eventType, event});
      return callback(null, data);
    }

    this.logger.debug('Processing the incoming event', {event});
    const eventHandler = EventHandlerFactory.getHandler(eventType, this.eventRepository, this.logger);

    callbackify(eventHandler.handle).call(eventHandler, event, callback);
  }
}
