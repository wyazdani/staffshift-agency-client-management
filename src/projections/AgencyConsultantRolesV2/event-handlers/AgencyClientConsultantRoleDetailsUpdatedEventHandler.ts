import {LoggerContext} from 'a24-logzio-winston';
import {
  AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface
} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {
  AgencyConsultantRolesProjectionV2,
  AgencyConsultantRolesProjectionV2DocumentType
} from '../../../models/AgencyConsultantRolesProjectionV2';
import {FilterQuery} from 'mongoose';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientConsultantRoleDetailsUpdatedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<EventStorePubSubModelInterface>> {
  constructor(
    private logger: LoggerContext,
    private query: FilterQuery<AgencyConsultantRolesProjectionV2DocumentType>,
    private eventData: {status: string} | AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface
  ) {}

  /**
   * Updates an existing record in the projection collection
   */
  async handle(): Promise<void> {
    const updateObject = this.eventData;
    const query = this.query;

    try {
      await AgencyConsultantRolesProjectionV2.updateOne(query, {$set: updateObject}, {});
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
