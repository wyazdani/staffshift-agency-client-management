import {AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {EventStoreCacheHelper} from '../../../helpers/EventStoreCacheHelper';

export class AgencyClientPayInAdvancePaymentTermAppliedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface>
  ): Promise<void> {
    const eventStoreCacheHelper = new EventStoreCacheHelper();
    const ttl = 100;
    const organisationJobEvent = await eventStoreCacheHelper.findEventById(event.causation_id, ttl);

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
            organisation_job: organisationJobEvent.sequence_id
          }
        }
      },
      {
        upsert: true
      }
    );
  }
}
