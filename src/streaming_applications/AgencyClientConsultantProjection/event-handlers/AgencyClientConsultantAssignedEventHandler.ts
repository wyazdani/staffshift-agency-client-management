import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyClientConsultantAssignedEventDataInterface} from '../types/EventDataTypes';
import {AgencyRepository} from '../../../Agency/AgencyRepository';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientConsultantAssignedEventHandler implements EventHandlerInterface {
  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Create a new agency client consultant record
   */
  async handle(event: AgencyClientConsultantAssignedEventDataInterface): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate(event.aggregate_id.agency_id);
    const role = agencyAggregate.getConsultantRole(event.data.consultant_role_id);
    const agencyClientConsultant = new AgencyClientConsultantsProjection({
      _id: event.data._id,
      agency_id: event.aggregate_id.agency_id,
      client_id: event.aggregate_id.client_id,
      consultant_role_id: event.data.consultant_role_id,
      consultant_role_name: role.name,
      consultant_id: event.data.consultant_id
    });

    await agencyClientConsultant.save();
  }
}
