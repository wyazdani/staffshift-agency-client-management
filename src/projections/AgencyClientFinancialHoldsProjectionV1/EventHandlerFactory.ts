import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../Events';
import {
  AgencyClientFinancialHoldAppliedEventHandler,
  AgencyClientFinancialHoldClearedEventHandler,
  AgencyClientFinancialHoldInheritedEventHandler,
  AgencyClientClearFinancialHoldInheritedEventHandler,
  AgencyClientEmptyFinancialHoldInheritedEventHandler
} from './event-handlers';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(eventType: EventsEnum, logger: LoggerContext): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED:
        return new AgencyClientFinancialHoldAppliedEventHandler();
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED:
        return new AgencyClientFinancialHoldClearedEventHandler();
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED:
        return new AgencyClientFinancialHoldInheritedEventHandler();
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED:
        return new AgencyClientClearFinancialHoldInheritedEventHandler();
      case EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED:
        return new AgencyClientEmptyFinancialHoldInheritedEventHandler();
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
