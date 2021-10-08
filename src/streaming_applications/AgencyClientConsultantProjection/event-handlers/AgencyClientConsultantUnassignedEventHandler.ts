import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../../../AgencyClient/types/CommandDataTypes';
import {EventStoreDocumentType} from '../../../models/EventStore';
import {AgencyClientAggregateIdInterface} from '../../../AgencyClient/types';

/**
 * Responsible for handling AgencyClientConsultantUnassigned event
 */
export class AgencyClientConsultantUnassignedEventHandler implements EventHandlerInterface {
  /**
   * Delete agency client consultant record
   */
  async handle(
    event: EventStoreDocumentType<AgencyClientAggregateIdInterface, RemoveAgencyClientConsultantCommandDataInterface>
  ): Promise<void> {
    await AgencyClientConsultantsProjection.deleteOne({_id: event.data._id});
  }
}
