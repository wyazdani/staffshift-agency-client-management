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
}
