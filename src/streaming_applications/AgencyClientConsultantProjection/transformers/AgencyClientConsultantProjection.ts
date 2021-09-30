import {Transform, TransformCallback, TransformOptions} from 'stream';
import {EventsEnum} from '../../../Events';
import {LoggerContext} from 'a24-logzio-winston';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {EventRepository} from '../../../EventRepository';
import {EventHandlerFactory} from '../factories/EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

interface OptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  logger: typeof LoggerContext;
}

export class AgencyClientConsultantProjection extends Transform {
  private readonly eventRepository: EventRepository;
  private logger: typeof LoggerContext;
  constructor(opts: OptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventRepository = opts.eventRepository;
    this.logger = opts.logger;
  }

  _transform(data: GenericObjectInterface, encoding: BufferEncoding, callback: TransformCallback): void {
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
      .catch((error) => callback(error));
  }
}
