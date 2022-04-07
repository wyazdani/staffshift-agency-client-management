import {EventRepository} from '../EventRepository';
import {AgencyClientCommandBusFactory} from '../factories/AgencyClientCommandBusFactory';
import {AgencyCommandBus} from './Agency/AgencyCommandBus';
import {AgencyRepository} from './Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from './Agency/AgencyWriteProjectionHandler';
import {AgencyClientCommandBus} from './AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from './AgencyClient/types';
import {AddAgencyClientConsultantCommandDataInterface} from './AgencyClient/types/CommandDataTypes';
import {AggregateCommandHandlerInterface} from './AggregateCommandHandlerInterface';
import {AggregateCommandInterface} from './AggregateCommandInterface';

export class CommandBus {
  private _commandRegistry: {[key: string]: AggregateCommandHandlerInterface} = {};
  private _agencyClientCommandBus: AgencyClientCommandBus;
  constructor(private eventRepository: EventRepository) {
    AgencyCommandBus.registerCommandHandlers(eventRepository, this);
  }

  registerAggregateCommand(cmd: AggregateCommandHandlerInterface): void {
    if (this._commandRegistry[cmd.commandType]) {
      throw new Error(`Duplicate command type registered, ${cmd.commandType} already exists`);
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
      throw new Error(`Command type: ${cmd.type} has not been registered`);
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
