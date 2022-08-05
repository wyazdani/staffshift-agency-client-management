import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientFinancialHoldClearedEventStoreDataInterface} from 'EventTypes/AgencyClientFinancialHoldClearedEventInterface';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../models/AgencyClientFinancialHoldsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientFinancialHoldClearedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientFinancialHoldClearedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientFinancialHoldClearedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.CLEARED,
          inherited: false,
          note: event.data.note
        }
      },
      {
        upsert: true
      }
    );
  }
}
