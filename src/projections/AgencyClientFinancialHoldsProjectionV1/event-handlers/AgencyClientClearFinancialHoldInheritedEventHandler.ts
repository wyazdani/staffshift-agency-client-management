import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientClearFinancialHoldInheritedEventStoreDataInterface} from 'EventTypes/AgencyClientClearFinancialHoldInheritedEventInterface';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../models/AgencyClientFinancialHoldsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientClearFinancialHoldInheritedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientClearFinancialHoldInheritedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientClearFinancialHoldInheritedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.CLEARED,
          inherited: true,
          note: event.data.note
        }
      },
      {
        upsert: true
      }
    );
  }
}
