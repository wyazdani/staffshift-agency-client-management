import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyConsultantRoleDetailsUpdatedEventDataInterface} from '../types/EventDataTypes';

/**
 * TODO
 */
export class AgencyConsultantRoleDetailsUpdatedEventHandler implements EventHandlerInterface {
  async handle(event: AgencyConsultantRoleDetailsUpdatedEventDataInterface): Promise<void> {
    await AgencyClientConsultantsProjection.updateMany(
      {consultant_role_id: event.data._id},
      {$set: {consultant_role_name: event.data.name}}
    );
  }
}
