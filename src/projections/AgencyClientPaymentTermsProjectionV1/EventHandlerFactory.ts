import {LoggerContext} from 'a24-logzio-winston';
import {RuntimeError} from 'a24-node-error-utils';
import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventsEnum} from '../../Events';
import {AgencyClientCreditPaymentTermAppliedEventHandler} from './event-handlers/AgencyClientCreditPaymentTermAppliedEventHandler';
import {AgencyClientCreditPaymentTermInheritedEventHandler} from './event-handlers/AgencyClientCreditPaymentTermInheritedEventHandler';
import {AgencyClientEmptyPaymentTermInheritedEventHandler} from './event-handlers/AgencyClientEmptyPaymentTermInheritedEventHandler';
import {AgencyClientPayInAdvancePaymentTermAppliedEventHandler} from './event-handlers/AgencyClientPayInAdvancePaymentTermAppliedEventHandler';
import {AgencyClientPayInAdvancePaymentTermInheritedEventHandler} from './event-handlers/AgencyClientPayInAdvancePaymentTermInheritedEventHandler';
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
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED:
        return new AgencyClientCreditPaymentTermAppliedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED:
        return new AgencyClientCreditPaymentTermInheritedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED:
        return new AgencyClientPayInAdvancePaymentTermAppliedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED:
        return new AgencyClientPayInAdvancePaymentTermInheritedEventHandler(logger, eventStoreCacheHelper);
      case EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED:
        return new AgencyClientEmptyPaymentTermInheritedEventHandler(logger, eventStoreCacheHelper);
      default:
        logger.error('No configured handler found for this event', {eventType});
        throw new RuntimeError(`No configured handler found for this event: ${eventType}`);
    }
  }
}
