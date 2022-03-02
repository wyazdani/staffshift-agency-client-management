import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {BaseEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventsEnum} from '../../Events';
import {ConsultantJobAssignCompletedEventHandler} from './event-handlers/ConsultantJobAssignCompletedEventHandler';
import {ConsultantJobAssignInitiatedEventHandler} from './event-handlers/ConsultantJobAssignInitiatedEventHandler';

export class EventHandlerFactory {
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
        return new ConsultantJobAssignInitiatedEventHandler(logger);
      case EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED:
        return new ConsultantJobAssignCompletedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new Error(`No configured handler found for this event: ${eventType}`);
    }
  }
}
