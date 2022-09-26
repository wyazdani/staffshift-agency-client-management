import {AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../models/AgencyClientPaymentTermsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {EventStoreCacheHelper} from '../../../helpers/EventStoreCacheHelper';
import {LoggerContext} from 'a24-logzio-winston';

export class AgencyClientPayInAdvancePaymentTermInheritedEventHandler
implements
    EventHandlerInterface<
      EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface>
    > {
  constructor(private logger: LoggerContext, private eventStoreCacheHelper: EventStoreCacheHelper) {}
  async handle(
    event: EventStoreModelInterface<AgencyClientPayInAdvancePaymentTermInheritedEventStoreDataInterface>
  ): Promise<void> {
    const ttl = '1m';

    const organisationJobEvent = await this.eventStoreCacheHelper.findEventById(event.causation_id, this.logger, ttl);

    await AgencyClientPaymentTermsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          payment_term: PAYMENT_TERM_PROJECTION_ENUM.PAY_IN_ADVANCE,
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
