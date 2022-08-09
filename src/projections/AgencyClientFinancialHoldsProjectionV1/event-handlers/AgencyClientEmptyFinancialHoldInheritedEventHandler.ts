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
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.NOT_SET
        },
        $unset: {
          note: 1 // We unset the note since an empty financial hold inherited event never have any note on it
        }
      },
      {
        upsert: true
      }
    );
  }
}
