import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientEmptyFinancialHoldInheritedEventStoreDataInterface} from 'EventTypes/AgencyClientEmptyFinancialHoldInheritedEventInterface';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../models/AgencyClientFinancialHoldsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientEmptyFinancialHoldInheritedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientEmptyFinancialHoldInheritedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientEmptyFinancialHoldInheritedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          inherited: true,
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.NOT_SET,
          note: event.data.note
        }
      },
      {
        upsert: true
      }
    );
  }
}
