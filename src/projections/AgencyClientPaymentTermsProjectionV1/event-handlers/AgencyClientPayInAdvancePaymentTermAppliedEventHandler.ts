import {AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientPayInAdvancePaymentTermAppliedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientPaymentTermsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          payment_term: PAYMENT_TERM_PROJECTION_ENUM.PAY_IN_ADVANCE,
          inherited: false,
          _etags: {
            [event.aggregate_id.name]: event.sequence_id,
            organisation_job: event.causation_id
          }
        }
      },
      {
        upsert: true
      }
    );
  }
}
