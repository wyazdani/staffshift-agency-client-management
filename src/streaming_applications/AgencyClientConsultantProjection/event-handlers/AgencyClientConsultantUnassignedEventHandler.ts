import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyClientConsultantUnassignedEventDataInterface} from '../types/EventDataTypes';

/**
 * Responsible for handling AgencyClientConsultantUnassigned event
 */
export class AgencyClientConsultantUnassignedEventHandler implements EventHandlerInterface {
  /**
   * Delete agency client consultant record
   */
  async handle(event: AgencyClientConsultantUnassignedEventDataInterface): Promise<void> {
    await AgencyClientConsultantsProjection.deleteOne({_id: event.data._id});
  }
}
