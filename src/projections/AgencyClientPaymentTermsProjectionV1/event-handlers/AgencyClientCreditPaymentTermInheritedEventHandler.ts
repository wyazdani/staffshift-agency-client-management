import {AgencyClientCreditPaymentTermInheritedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {EventStoreCacheHelper} from '../../../helpers/EventStoreCacheHelper';
import {LoggerContext} from 'a24-logzio-winston';

export class AgencyClientCreditPaymentTermInheritedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientCreditPaymentTermInheritedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext, private eventStoreCacheHelper: EventStoreCacheHelper) {}
  async handle(
    event: EventStoreModelInterface<AgencyClientCreditPaymentTermInheritedEventStoreDataInterface>
  ): Promise<void> {
    const organisationJobEvent = await this.eventStoreCacheHelper.findEventById(event.causation_id, this.logger);

    await AgencyClientPaymentTermsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          payment_term: PAYMENT_TERM_PROJECTION_ENUM.CREDIT,
          inherited: true,
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
