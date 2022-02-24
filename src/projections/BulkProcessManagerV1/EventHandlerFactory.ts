import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {BaseEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventsEnum} from '../../Events';
import {ConsultantAssignInitiatedEventHandler} from './event-handlers/ConsultantAssignInitiatedEventHandler';

export class EventHandlerFactory {
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.CONSULTANT_ASSIGN_INITIATED:
        return new ConsultantAssignInitiatedEventHandler(logger);
      case EventsEnum.CONSULTANT_ASSIGN_COMPLETED:
        return new ConsultantAssignInitiatedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new Error(`No configured handler found for this event: ${eventType}`);
    }
  }
}
