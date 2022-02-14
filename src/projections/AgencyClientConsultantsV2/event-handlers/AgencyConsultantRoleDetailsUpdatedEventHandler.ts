import {AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjectionV2} from '../../../models/AgencyClientConsultantsProjectionV2';
import {EventStoreModelInterface} from '../../../models/EventStore';

/**
 * Responsible for handling AgencyConsultantRoleDetailsUpdated event
 */
export class AgencyConsultantRoleDetailsUpdatedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface>> {
  /**
   * Update consultant role name for all agency client consultants with that role
   */
  async handle(
    event: EventStoreModelInterface<AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientConsultantsProjectionV2.updateMany(
      {consultant_role_id: event.data._id},
      {$set: {consultant_role_name: event.data.name}}
    );
  }
}
