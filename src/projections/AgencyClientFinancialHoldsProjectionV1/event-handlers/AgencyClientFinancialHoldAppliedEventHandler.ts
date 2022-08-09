import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientFinancialHoldAppliedEventStoreDataInterface} from 'EventTypes/AgencyClientFinancialHoldAppliedEventInterface';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../models/AgencyClientFinancialHoldsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientFinancialHoldAppliedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientFinancialHoldAppliedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientFinancialHoldAppliedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.APPLIED,
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
