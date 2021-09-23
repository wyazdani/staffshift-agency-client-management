import {AgencyClientCommandHandlerInterface, AgencyClientCommand} from './Interfaces';

export class AgencyClientCommandBus {
  private commandHandlers: AgencyClientCommandHandlerInterface[] = [];

  addHandler(commandHandler: AgencyClientCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  async execute(agencyId: string, clientId: string, command: AgencyClientCommand): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, clientId, command.data);
  }
}
