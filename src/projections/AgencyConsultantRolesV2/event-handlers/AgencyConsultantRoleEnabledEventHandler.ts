import {LoggerContext} from 'a24-logzio-winston';
import {AgencyConsultantRoleEnabledEventStoreDataInterface} from 'EventTypes';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {AgencyConsultantRolesProjectionV2} from '../../../models/AgencyConsultantRolesProjectionV2';

/**
 * Responsible for handling AgencyConsultantRoleEnabled event
 */
export class AgencyConsultantRoleEnabledEventHandler {
  constructor(private logger: LoggerContext) {}

  /**
   * Updates status to enabled for an existing record in the projection collection
   */
  async handle(event: EventStoreModelInterface<AgencyConsultantRoleEnabledEventStoreDataInterface>): Promise<void> {
    const updateObject = {status: 'enabled'};
    const query = {
      _id: event.data._id,
      agency_id: event.aggregate_id.agency_id
    };

    try {
      await AgencyConsultantRolesProjectionV2.updateOne(query, {$set: updateObject});
    } catch (error) {
      this.logger.error('Error updating a record to the consultant role projection', {
        query,
        updateObject,
        error
      });
      throw error;
    }
  }
}
