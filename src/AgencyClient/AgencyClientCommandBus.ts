import {AgencyClientCommandHandlerInterface} from './types/AgencyClientCommandHandlerInterface';
import {AgencyClientCommandInterface} from './types';

/**
 * Responsible for routing all agency client related commands to their corresponding handlers
 */
export class AgencyClientCommandBus {
  private commandHandlers: AgencyClientCommandHandlerInterface[] = [];

  /**
   * Add a command handler to the list of supported handlers
   */
  addHandler(commandHandler: AgencyClientCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  /**
   * Execute the command by finding it's corresponding handler
   */
  async execute(agencyId: string, clientId: string, command: AgencyClientCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, clientId, command.data);
  }
}
