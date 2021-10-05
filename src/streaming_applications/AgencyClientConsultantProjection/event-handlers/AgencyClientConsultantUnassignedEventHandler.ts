import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {EventInterface} from '../types/EventInterface';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../../../AgencyClient/types/CommandDataTypes';

/**
 * Responsible for handling AgencyClientConsultantUnassigned event
 */
export class AgencyClientConsultantUnassignedEventHandler implements EventHandlerInterface {
  /**
   * Delete agency client consultant record
   */
  async handle(event: EventInterface<RemoveAgencyClientConsultantCommandDataInterface>): Promise<void> {
    await AgencyClientConsultantsProjection.deleteOne({_id: event.data._id});
  }
}
