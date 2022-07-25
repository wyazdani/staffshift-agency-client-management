import {AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientPayInAdvancePaymentTermInheritedEventHandler
implements
    EventHandlerInterface<
      EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface>
    >
{
  async handle(
    event: EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientPaymentTermsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          payment_term: PAYMENT_TERM_PROJECTION_ENUM.PAY_IN_ADVANCE,
          inherited: true
        }
      },
      {
        upsert: true
      }
    );
  }
}
