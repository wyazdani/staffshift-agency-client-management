import {EventStore} from '../../../src/models/EventStore';
import {AgencyClientEventEnum} from '../../../src/AgencyClient/types';

/**
 * Responsible for setting up agency client link events and removing them
 */
export class CreateAgencyClientLinkScenario {
  static async createAggregateEvents(agencyId: string, clientId: string): Promise<void> {
    await EventStore.create([
      {
        type: AgencyClientEventEnum.AGENCY_CLIENT_LINKED,
        aggregate_id: {agency_id: agencyId, client_id: clientId},
        data: {
          client_type: 'organisation'
        },
        sequence_id: 1,
        correlation_id: 1,
        meta_data: {
          user_id: '123'
        }
      }
    ]);
  }

  static async removeAggregateEvents(agencyId: string, clientId: string): Promise<void> {
    await EventStore.deleteMany({
      aggregate_id: {agency_id: agencyId, client_id: clientId}
    }).exec();
  }
}
