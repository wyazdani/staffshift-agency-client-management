import {ConsultantJobCommandHandlerInterface} from './types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandInterface} from './types';

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobCommandBus {
  private commandHandlers: ConsultantJobCommandHandlerInterface[] = [];

  /**
   * Add a command handler to the list of supported handlers
   */
  addHandler(commandHandler: ConsultantJobCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  /**
   * Execute the command by finding it's corresponding handler
   */
  async execute(agencyId: string, command: ConsultantJobCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, command.data);
  }
}