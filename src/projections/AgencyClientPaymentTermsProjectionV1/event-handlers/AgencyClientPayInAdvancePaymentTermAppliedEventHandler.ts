import {AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {CacheHelper} from '../../../helpers/CacheHelper';

export class AgencyClientPayInAdvancePaymentTermAppliedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermAppliedEventStoreDataInterface>
  ): Promise<void> {
    const cacheHelper = new CacheHelper();
    const key = `${event.aggregate_id.agency_id}_${event.aggregate_id.client_id}_org_job`;
    const organisationJobEvent = await cacheHelper.cacheRetrieveEvent(key, event.causation_id, 100);

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
