import {LoggerContext} from 'a24-logzio-winston';
import {AgencyConsultantRoleAddedEventStoreDataInterface} from 'EventTypes';
import {MongoError} from 'mongodb';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {AgencyConsultantRolesProjectionV2} from '../../../models/AgencyConsultantRolesProjectionV2';
/**
 * Responsible for handling AgencyConsultantRoleAdded event
 */
export class AgencyConsultantRoleAddedEventHandler {
  constructor(private logger: LoggerContext) {}

  /**
   * Adds a new record to the projection collection
   */
  async handle(event: EventStoreModelInterface<AgencyConsultantRoleAddedEventStoreDataInterface>): Promise<void> {
    const eventData = event.data;
    const record = {
      agency_id: event.aggregate_id.agency_id,
      name: eventData.name,
      description: eventData.description,
      max_consultants: eventData.max_consultants,
      _id: eventData._id
    };

    try {
      await AgencyConsultantRolesProjectionV2.create(record);
    } catch (error) {
      if ((error as MongoError).code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        this.logger.notice('Duplicate key error for agency consultant role record', record);
        return;
      }
      this.logger.error('Error saving a record to the consultant role projection', error);
      throw error;
    }
  }
}
