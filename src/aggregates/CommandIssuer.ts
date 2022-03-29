import {EventRepository} from '../EventRepository';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
import {AgencyCommandBusFactory} from '../factories/AgencyCommandBusFactory';
import {AgencyCommandBus} from './Agency/AgencyCommandBus';
import {AgencyRepository} from './Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from './Agency/AgencyWriteProjectionHandler';
import {AgencyCommandEnum} from './Agency/types';
import {AddAgencyConsultantRoleCommandDataInterface} from './Agency/types/CommandDataTypes';
import {AgencyClientCommandBus} from './AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from './AgencyClient/types';
import {AddAgencyClientConsultantCommandDataInterface} from './AgencyClient/types/CommandDataTypes';

export class CommandIssuer {
  private _agencyCommandBus: AgencyCommandBus;
  private _agencyClientCommandBus: AgencyClientCommandBus;
  constructor(private eventRepository: EventRepository) {}
  private get agencyCommandBus() {
    if (!this._agencyCommandBus) {
      this._agencyCommandBus = AgencyCommandBusFactory.getCommandBus(this.eventRepository);
    }
    return this._agencyCommandBus;
  }
  private get agencyClientCommandBus() {
    if (!this._agencyClientCommandBus) {
      const agencyRepository = new AgencyRepository(this.eventRepository, new AgencyWriteProjectionHandler());

      this._agencyClientCommandBus = AgencyClientCommandBusFactory.getCommandBus(
        this.eventRepository,
        agencyRepository
      );
    }
    return this._agencyClientCommandBus;
  }
  async addAgencyConsultantRole(agencyId: string, data: AddAgencyConsultantRoleCommandDataInterface): Promise<void> {
    await this.agencyCommandBus.execute(agencyId, {
      type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
      data
    });
  }

  async addAgencyClientConsultant(
    agencyId: string,
    clientId: string,
    data: AddAgencyClientConsultantCommandDataInterface
  ): Promise<void> {
    await this.agencyClientCommandBus.execute(agencyId, clientId, {
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data
    });
  }
}
