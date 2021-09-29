import {AgencyClientCommandEnum} from '../../../src/AgencyClient/types';
import {AgencyClientCommandBusFactory} from '../../../src/factories/AgencyClientCommandBusFactory';
import {AbstractScenario} from './Scenario';

/**
 * Responsible for triggering agency client commands
 */
export class AgencyClientScenario extends AbstractScenario {
  async linkAgencyClient(agencyId, clientId) {
    await AgencyClientCommandBusFactory.getCommandBus(this.eventRepository).execute(agencyId, clientId, {
      type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT,
      data: {
        client_type: 'organisation'
      }
    });
  }
}
