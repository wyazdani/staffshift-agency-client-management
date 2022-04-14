import {AgencyClientCommandEnum} from '../../../src/aggregates/AgencyClient/types';
import {
  LinkAgencyClientCommandInterface,
  AddAgencyClientConsultantCommandInterface
} from '../../../src/aggregates/AgencyClient/types/CommandTypes';
import {AbstractScenario} from './AbstractScenario';

/**
 * Responsible for triggering agency client commands
 */
export class AgencyClientScenario extends AbstractScenario {
  /**
   * Trigger linkAgencyClient command
   */
  async linkAgencyClient(agencyId: string, clientId: string): Promise<void> {
    const command: LinkAgencyClientCommandInterface = {
      aggregateId: {
        client_id: clientId,
        agency_id: agencyId
      },
      type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT,
      data: {
        client_type: 'organisation'
      }
    };

    await this.commandBus.execute(command);
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
    const command: AddAgencyClientConsultantCommandInterface = {
      aggregateId: {
        client_id: record.clientId,
        agency_id: record.agencyId
      },
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: record.consultantRecordId,
        consultant_role_id: record.consultantRoleId,
        consultant_id: record.consultantId
      }
    };

    await this.commandBus.execute(command);
  }
}
