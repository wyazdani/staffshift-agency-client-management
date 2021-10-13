import {AgencyClientConsultantUnassignedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
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
    await AgencyClientConsultantsProjection.deleteOne({_id: event.data._id});
  }
}
