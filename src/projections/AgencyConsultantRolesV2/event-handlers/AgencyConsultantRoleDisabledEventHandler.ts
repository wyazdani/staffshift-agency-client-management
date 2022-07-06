import {LoggerContext} from 'a24-logzio-winston';
import {AgencyConsultantRoleDisabledEventStoreDataInterface} from 'EventTypes';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {AgencyConsultantRolesProjectionV2} from '../../../models/AgencyConsultantRolesProjectionV2';

/**
 * Responsible for handling AgencyConsultantRoleDisabled event
 */
export class AgencyConsultantRoleDisabledEventHandler {
  constructor(private logger: LoggerContext) {}

  /**
   * Updates status to disabled for an existing record in the projection collection
   */
  async handle(event: EventStoreModelInterface<AgencyConsultantRoleDisabledEventStoreDataInterface>): Promise<void> {
    const updateObject = {status: 'disabled'};
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
