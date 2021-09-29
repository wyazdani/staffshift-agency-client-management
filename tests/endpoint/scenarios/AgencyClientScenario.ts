import {AgencyClientCommandEnum} from '../../../src/AgencyClient/types';
import {AgencyClientCommandBusFactory} from '../../../src/factories/AgencyClientCommandBusFactory';
import {AbstractScenario} from './Scenario';

/**
 * Responsible for triggering agency client commands
 */
export class AgencyClientScenario extends AbstractScenario {
  /**
   * Trigger linkAgencyClient command
   */
  async linkAgencyClient(agencyId: string, clientId: string) {
    await AgencyClientCommandBusFactory.getCommandBus(this.eventRepository).execute(agencyId, clientId, {
      type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT,
      data: {
        client_type: 'organisation'
      }
    });
  }

  /**
   * Trigger addAgencyClientConsultant command
   */
  async addAgencyClientConsultant(record: {
    agencyId: string;
    clientId: string;
    consultantId: string;
    consultantRoleId: string;
    consultantRecordId: string;
  }): Promise<void> {
    await AgencyClientCommandBusFactory.getCommandBus(this.eventRepository).execute(record.agencyId, record.clientId, {
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: record.consultantRecordId,
        consultant_role_id: record.consultantRoleId,
        consultant_id: record.consultantId
      }
    });
  }
}
