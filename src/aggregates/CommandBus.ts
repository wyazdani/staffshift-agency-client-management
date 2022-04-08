import {EventRepository} from '../EventRepository';
import {AgencyCommandBus} from './Agency/AgencyCommandBus';
import {AgencyClientCommandBus} from './AgencyClient/AgencyClientCommandBus';
import {AggregateCommandInterface, AggregateCommandHandlerInterface} from './types';

export class CommandBus {
  private _commandRegistry: {[key: string]: AggregateCommandHandlerInterface} = {};

  constructor(eventRepository: EventRepository) {
    AgencyCommandBus.registerCommandHandlers(eventRepository, this);
    AgencyClientCommandBus.registerCommandHandlers(eventRepository, this);
  }

  registerAggregateCommand(cmd: AggregateCommandHandlerInterface): void {
    if (this._commandRegistry[cmd.commandType]) {
      throw new Error(`Duplicate command type registered, ${cmd.commandType} already exists`);
    }
    this._commandRegistry[cmd.commandType] = cmd;
  }

  async execute(cmd: AggregateCommandInterface): Promise<void> {
    if (!this._commandRegistry[cmd.type]) {
      throw new Error(`Command type: ${cmd.type} has not been registered`);
    }
    return this._commandRegistry[cmd.type].execute(cmd);
  }
}
