import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {
  AgencyClientsProjectionV2,
  AgencyClientsProjectionV2DocumentType
} from '../../../models/AgencyClientsProjectionV2';
import {AgencyClientLinkedEventStoreDataInterface} from 'EventTypes';
import {FilterQuery} from 'mongoose';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientLinkedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientLinkedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext) {}

  /**
   * Create a new agency client consultant record
   */
  async handle(event: EventStoreModelInterface<AgencyClientLinkedEventStoreDataInterface>): Promise<void> {
    const criteria: FilterQuery<AgencyClientsProjectionV2DocumentType> = {
      agency_id: event.aggregate_id.agency_id as string,
      client_id: event.aggregate_id.client_id as string
    };

    if (event.data.organisation_id) {
      criteria.organisation_id = event.data.organisation_id;
    }
    if (event.data.site_id) {
      criteria.site_id = event.data.site_id;
    }
    try {
      await AgencyClientsProjectionV2.findOneAndUpdate(
        criteria,
        {
          client_type: event.data.client_type,
          linked: true
        },
        {upsert: true}
      );
    } catch (error) {
      if (error.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        this.logger.notice('Duplicate key error for agency client record');
        return;
      }

      this.logger.error('Error occurred while creating agency client record', {
        originalError: error
      });
      throw error;
    }
  }
}
