import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyConsultantRoleDetailsUpdatedEventDataInterface} from '../types/EventDataTypes';
import {EventInterface} from '../types/EventInterface';

/**
 * Responsible for handling AgencyConsultantRoleDetailsUpdated event
 */
export class AgencyConsultantRoleDetailsUpdatedEventHandler implements EventHandlerInterface {
  /**
   * Update consultant role name for all agency client consultants with that role
   * @param event
   */
  async handle(event: EventInterface<AgencyConsultantRoleDetailsUpdatedEventDataInterface>): Promise<void> {
    await AgencyClientConsultantsProjection.updateMany(
      {consultant_role_id: event.data._id},
      {$set: {consultant_role_name: event.data.name}}
    );
  }
}
