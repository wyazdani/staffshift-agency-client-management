import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventsEnum} from '../../Events';
import {JobCompletedEventHandler} from './event-handlers/JobCompletedEventHandler';
import {JobInitiatedEventHandler} from './event-handlers/JobInitiatedEventHandler';

export class EventHandlerFactory {
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
      case EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED:
      case EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED:
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED:
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED:
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED:
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED:
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED:
        return new JobInitiatedEventHandler(logger);
      case EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED:
      case EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED:
      case EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED:
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED:
      case EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED:
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED:
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED:
      case EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED:
        return new JobCompletedEventHandler(logger);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new Error(`No configured handler found for this event: ${eventType}`);
    }
  }
}
