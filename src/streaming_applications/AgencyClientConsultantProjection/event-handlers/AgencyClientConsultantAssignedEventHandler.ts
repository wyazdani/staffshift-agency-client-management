import {AgencyClientConsultantAssignedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyRepository} from '../../../Agency/AgencyRepository';
import {EventStoreModelInterface} from '../../../models/EventStore';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientConsultantAssignedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientConsultantAssignedEventStoreDataInterface>> {
  constructor(private agencyRepository: AgencyRepository) {}

  /**
   * Create a new agency client consultant record
   * handle(event: EventStoreModelInterface<EventDataInterface>): Promise<void>;
   */
  async handle(event: EventStoreModelInterface<AgencyClientConsultantAssignedEventStoreDataInterface>): Promise<void> {
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
