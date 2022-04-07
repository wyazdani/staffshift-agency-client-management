import {EventRepository} from '../EventRepository';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
import {AgencyCommandBus} from './Agency/AgencyCommandBus';
import {AgencyRepository} from './Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from './Agency/AgencyWriteProjectionHandler';
import {AgencyCommandEnum} from './Agency/types';
import {AddAgencyConsultantRoleCommandDataInterface} from './Agency/types/CommandDataTypes';
import {AgencyClientCommandBus} from './AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from './AgencyClient/types';
import {AddAgencyClientConsultantCommandDataInterface} from './AgencyClient/types/CommandDataTypes';
import {AggregateCommandBusType} from './AggregateCommandBusType';
import {AggregateCommandHandlerInterface} from './AggregateCommandHandlerInterface';
import {AggregateCommandInterface} from './AggregateCommandInterface';

export class CommandBus {
  private _commandRegistry: {[key: string]: AggregateCommandHandlerInterface} = {};
  private _agencyCommandBus: AgencyCommandBus;
  private _agencyClientCommandBus: AgencyClientCommandBus;
  constructor(private eventRepository: EventRepository) {
    AgencyCommandBus.registerCommandHandlers(eventRepository, this);
    // console.log(this._commandRegistry);
  }

  registerAggregateCommand(cmd: AggregateCommandHandlerInterface): void {
    if (this._commandRegistry[cmd.commandType]) {
      // console.log('DUPLICATE REGISTRY THINGS ARE BAD AND EXPLODE');
    }
    this._commandRegistry[cmd.commandType] = cmd;
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

  async execute(cmd: AggregateCommandInterface): Promise<void> {
    if (!this._commandRegistry[cmd.type]) {
      // console.log(`THERE WAS NO CMD REGISTERED FOR ${cmd.type}`);
    }
    return this._commandRegistry[cmd.type].execute(cmd);
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
