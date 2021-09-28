import {EventStore} from '../../../src/models/EventStore';
import {AgencyEventEnum} from '../../../src/Agency/types';

export class CreateAgencyConsultantRoleScenario {
  static async createAggregateEvents(agencyId: string, roleId?: string): Promise<void> {
    await EventStore.create([
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: {agency_id: agencyId},
        data: {
          _id: roleId || '6141d64365e0e52381000001',
          name: 'test role',
          description: 'description',
          max_consultants: 5
        },
        sequence_id: 0,
        correlation_id: 1,
        meta_data: {
          user_id: '123'
        }
      },
      {
        type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: {agency_id: agencyId},
        data: {
          _id: roleId || '6141d64365e0e52381000001'
        },
        sequence_id: 1,
        correlation_id: 1,
        meta_data: {
          user_id: '123'
        }
      }
    ]);
  }

  static async removeAggregateEvents(agencyId: string): Promise<void> {
    await EventStore.deleteMany({aggregate_id: {agency_id: agencyId}}).exec();
  }
}
