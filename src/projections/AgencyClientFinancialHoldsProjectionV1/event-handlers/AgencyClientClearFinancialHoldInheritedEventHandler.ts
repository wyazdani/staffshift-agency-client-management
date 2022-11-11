import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreCacheHelper} from '../../../helpers/EventStoreCacheHelper';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientClearFinancialHoldInheritedEventStoreDataInterface} from 'EventTypes/AgencyClientClearFinancialHoldInheritedEventInterface';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../models/AgencyClientFinancialHoldsProjectionV1';
import {EventStoreModelInterface} from '../../../models/EventStore';

export class AgencyClientClearFinancialHoldInheritedEventHandler
implements
    EventHandlerInterface<EventStoreModelInterface<AgencyClientClearFinancialHoldInheritedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext, private eventStoreCacheHelper: EventStoreCacheHelper) {}
  async handle(
    event: EventStoreModelInterface<AgencyClientClearFinancialHoldInheritedEventStoreDataInterface>
  ): Promise<void> {
    const organisationJobEvent = await this.eventStoreCacheHelper.findEventById(event.causation_id, this.logger);

    await AgencyClientFinancialHoldsProjection.updateOne(
      {
        agency_id: event.aggregate_id.agency_id,
        client_id: event.aggregate_id.client_id
      },
      {
        $set: {
          financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.CLEARED,
          inherited: true,
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
