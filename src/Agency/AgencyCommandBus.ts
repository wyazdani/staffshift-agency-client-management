import {AgencyCommandHandlerInterface} from './types/AgencyCommandHandlerInterface';
import {AgencyCommandInterface} from './types';

/**
 * Responsible for routing all agency related commands to their corresponding handlers
 */
export class AgencyCommandBus {
  private commandHandlers: AgencyCommandHandlerInterface[] = [];

  /**
   * Add a command handler to the list of supported handlers
   */
  addHandler(commandHandler: AgencyCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  /**
   * Execute the command by finding it's corresponding handler
   */
  async execute(agencyId: string, command: AgencyCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, command.data);
  }
}
