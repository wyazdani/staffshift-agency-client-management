import {AgencyClientConsultantUnassignedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientConsultantsProjectionV3} from '../../../models/AgencyClientConsultantsProjectionV3';
import {EventStoreModelInterface} from '../../../models/EventStore';

/**
 * Responsible for handling AgencyClientConsultantUnassigned event
 */
export class AgencyClientConsultantUnassignedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientConsultantUnassignedEventStoreDataInterface>> {
  /**
   * Delete agency client consultant record
   */
  async handle(
    event: EventStoreModelInterface<AgencyClientConsultantUnassignedEventStoreDataInterface>
  ): Promise<void> {
    await AgencyClientConsultantsProjectionV3.deleteOne({_id: event.data._id});
  }
}
