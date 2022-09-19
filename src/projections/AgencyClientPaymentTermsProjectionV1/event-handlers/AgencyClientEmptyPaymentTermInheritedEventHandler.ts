import {AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientEmptyPaymentTermInheritedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientPaymentTermsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          inherited: true,
          payment_term: PAYMENT_TERM_PROJECTION_ENUM.NOT_SET,
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
