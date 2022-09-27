import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreCacheHelper} from '../../../helpers/EventStoreCacheHelper';
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
  constructor(private logger: LoggerContext, private eventStoreCacheHelper: EventStoreCacheHelper) {}
  async handle(
    event: EventStoreModelInterface<AgencyClientEmptyFinancialHoldInheritedEventStoreDataInterface>
  ): Promise<void> {
    const organisationJobEvent = await this.eventStoreCacheHelper.findEventById(event.causation_id, this.logger);

    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          inherited: true,
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.NOT_SET,
          note: event.data.note,
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
