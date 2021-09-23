import {AgencyClientCommandHandlerInterface} from './types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandInterface} from './types';

export class AgencyClientCommandBus {
  private commandHandlers: AgencyClientCommandHandlerInterface[] = [];

  addHandler(commandHandler: AgencyClientCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  async execute(agencyId: string, clientId: string, command: AgencyClientCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, clientId, command.data);
  }
}
