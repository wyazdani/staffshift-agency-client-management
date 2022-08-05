import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientFinancialHoldInheritedEventStoreDataInterface} from 'EventTypes/AgencyClientFinancialHoldInheritedEventInterface';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../models/AgencyClientFinancialHoldsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientFinancialHoldInheritedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientFinancialHoldInheritedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientFinancialHoldInheritedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.APPLIED,
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
