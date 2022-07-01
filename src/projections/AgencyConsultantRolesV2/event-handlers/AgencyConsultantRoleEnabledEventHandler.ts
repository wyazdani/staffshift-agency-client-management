import {LoggerContext} from 'a24-logzio-winston';
import {AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface, BaseEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {
  AgencyConsultantRolesProjectionV2,
  AgencyConsultantRolesProjectionV2DocumentType
} from '../../../models/AgencyConsultantRolesProjectionV2';
import {FilterQuery} from 'mongoose';

/**
 * Responsible for handling AgencyConsultantRoleEnabled event
 */
export class AgencyConsultantRoleEnabledEventHandler
implements EventHandlerInterface<EventStoreModelInterface<EventStorePubSubModelInterface>> {
  constructor(private logger: LoggerContext) {}

  /**
   * Updates status to enabled for an existing record in the projection collection
   */
  async handle(event: EventStoreModelInterface<EventStorePubSubModelInterface>): Promise<void> {
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
