import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventsEnum} from '../../Events';
import {ConsultantJobCompletedEventHandler} from './event-handlers/ConsultantJobCompletedEventHandler';
import {ConsultantJobInitiatedEventHandler} from './event-handlers/ConsultantJobInitiatedEventHandler';

export class EventHandlerFactory {
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
      case EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED:
      case EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED:
        return new ConsultantJobInitiatedEventHandler(logger);
      case EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED:
      case EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED:
      case EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED:
        return new ConsultantJobCompletedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new Error(`No configured handler found for this event: ${eventType}`);
    }
  }
}
