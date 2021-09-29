import {AgencyCommandEnum} from '../../../src/Agency/types';
import {AgencyCommandBusFactory} from '../../../src/factories/AgencyCommandBusFactory';
import {AbstractScenario} from './Scenario';

/**
 * Responsible for triggering agency consultant role commands
 */
export class AgencyConsultantRoleScenario extends AbstractScenario {
  /**
   * Trigger addAgencyConsultantRole command
   */
  async addAgencyConsultantRole(agencyId: string, roleId: string) {
    await AgencyCommandBusFactory.getCommandBus(this.eventRepository).execute(agencyId, {
      type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
      data: {
        _id: roleId,
        name: 'random',
        description: 'test random description',
        max_consultants: 10
      }
    });
  }
}
