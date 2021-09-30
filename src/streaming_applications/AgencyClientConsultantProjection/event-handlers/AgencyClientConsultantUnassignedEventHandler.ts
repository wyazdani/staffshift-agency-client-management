import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyClientConsultantUnassignedEventDataInterface} from '../types/EventDataTypes';

/**
 * TODO
 */
export class AgencyClientConsultantUnassignedEventHandler implements EventHandlerInterface {
  async handle(event: AgencyClientConsultantUnassignedEventDataInterface): Promise<void> {
    await AgencyClientConsultantsProjection.deleteOne({_id: event.data._id});
  }
}
