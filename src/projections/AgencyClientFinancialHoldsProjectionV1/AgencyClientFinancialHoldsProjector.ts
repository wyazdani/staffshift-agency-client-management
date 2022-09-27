import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreCacheHelper} from '../../helpers/EventStoreCacheHelper';
import {EventStoreListenerInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {EventHandlerFactory} from './EventHandlerFactory';

const events = [
  EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED,
  EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED,
  EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED,
  EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
  EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED
];

export default class AgencyClientFinancialHoldsProjector implements EventStoreListenerInterface {
  private eventStoreCacheHelper: EventStoreCacheHelper;
  private readonly ttl = '1m';
  private readonly max = 10;
  constructor() {
    this.eventStoreCacheHelper = new EventStoreCacheHelper(this.ttl, this.max);
  }
  async onEvent(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventType: EventsEnum = event.type as EventsEnum;

    if (!events.includes(eventType)) {
      logger.debug('Incoming event ignored', {eventType, event});
      return;
    }

    logger.debug('Processing the incoming event', {event});
    const eventHandler = EventHandlerFactory.getHandler(eventType, logger, this.eventStoreCacheHelper);

    await eventHandler.handle(event);
  }
}
