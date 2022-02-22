import {ConsultantCommandHandlerInterface} from './types/ConsultantCommandHandlerInterface';
import {ConsultantCommandInterface} from './types';

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantCommandBus {
  private commandHandlers: ConsultantCommandHandlerInterface[] = [];

  /**
   * Add a command handler to the list of supported handlers
   */
  addHandler(commandHandler: ConsultantCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  /**
   * Execute the command by finding it's corresponding handler
   */
  async execute(agencyId: string, command: ConsultantCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, command.data);
  }
}
