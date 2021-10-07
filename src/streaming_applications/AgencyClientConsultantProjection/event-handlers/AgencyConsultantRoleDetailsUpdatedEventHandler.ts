import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {UpdateAgencyConsultantRoleCommandDataInterface} from '../../../Agency/types/CommandDataTypes';
import {EventStoreDocumentType} from '../../../models/EventStore';
import {AgencyAggregateIdInterface} from '../../../Agency/types';

/**
 * Responsible for handling AgencyConsultantRoleDetailsUpdated event
 */
export class AgencyConsultantRoleDetailsUpdatedEventHandler
implements EventHandlerInterface<UpdateAgencyConsultantRoleCommandDataInterface, AgencyAggregateIdInterface> {
  /**
   * Update consultant role name for all agency client consultants with that role
   */
  async handle(
    event: EventStoreDocumentType<UpdateAgencyConsultantRoleCommandDataInterface, AgencyAggregateIdInterface>
  ): Promise<void> {
    await AgencyClientConsultantsProjection.updateMany(
      {consultant_role_id: event.data._id},
      {$set: {consultant_role_name: event.data.name}}
    );
  }
}
