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
import {EventStoreCacheHelper} from '../../helpers/EventStoreCacheHelper';

/**
 * Responsible for building different event handlers
 */
export class EventHandlerFactory {
  /**
   * Return event handler based on the event type
   */
  static getHandler(
    eventType: EventsEnum,
    logger: LoggerContext,
    eventStoreCacheHelper: EventStoreCacheHelper
  ): EventHandlerInterface<BaseEventStoreDataInterface> {
    switch (eventType) {
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED:
        return new AgencyClientFinancialHoldAppliedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED:
        return new AgencyClientFinancialHoldClearedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED:
        return new AgencyClientFinancialHoldInheritedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED:
        return new AgencyClientClearFinancialHoldInheritedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED:
        return new AgencyClientEmptyFinancialHoldInheritedEventHandler(logger, eventStoreCacheHelper);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
