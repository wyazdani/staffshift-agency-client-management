import {AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
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
    await AgencyClientConsultantsProjection.updateMany(
      {consultant_role_id: event.data._id},
      {$set: {consultant_role_name: event.data.name}}
    );
  }
}
