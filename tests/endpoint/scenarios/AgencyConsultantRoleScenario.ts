import {AgencyCommandEnum} from '../../../src/aggregates/Agency/types';
import {AddAgencyConsultantRoleCommandInterface} from '../../../src/aggregates/Agency/types/CommandTypes';
import {AbstractScenario} from './AbstractScenario';

/**
 * Responsible for triggering agency consultant role commands
 */
export class AgencyConsultantRoleScenario extends AbstractScenario {
  /**
   * Trigger addAgencyConsultantRole command
   */
  async addAgencyConsultantRole(agencyId: string, roleId: string): Promise<void> {
    const command: AddAgencyConsultantRoleCommandInterface = {
      aggregateId: {
        agency_id: agencyId
      },
      type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
      data: {
        _id: roleId,
        name: 'random',
        description: 'test random description',
        max_consultants: 10
      }
    };

    await this.commandBus.execute(command);
  }
}
