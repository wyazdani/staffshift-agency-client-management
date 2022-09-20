import {AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {CacheHelper} from '../../../helpers/CacheHelper';

export class AgencyClientEmptyPaymentTermInheritedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface>> {
  async handle(
    event: EventStoreModelInterface<AgencyClientEmptyPaymentTermInheritedEventStoreDataInterface>
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
          inherited: true,
          payment_term: PAYMENT_TERM_PROJECTION_ENUM.NOT_SET,
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
