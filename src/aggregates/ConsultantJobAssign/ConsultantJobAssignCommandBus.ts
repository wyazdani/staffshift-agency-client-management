import {ConsultantJobAssignCommandHandlerInterface} from './types/ConsultantJobAssignCommandHandlerInterface';
import {ConsultantJobAssignCommandInterface} from './types';

/**
 * Responsible for routing all commands to their corresponding handlers
 */
export class ConsultantJobAssignCommandBus {
  private commandHandlers: ConsultantJobAssignCommandHandlerInterface[] = [];

  /**
   * Add a command handler to the list of supported handlers
   */
  addHandler(commandHandler: ConsultantJobAssignCommandHandlerInterface) {
    this.commandHandlers.push(commandHandler);
    return this;
  }

  /**
   * Execute the command by finding it's corresponding handler
   */
  async execute(agencyId: string, jobId: string, command: ConsultantJobAssignCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }

    await commandHandler.execute(agencyId, jobId, command.data);
  }
}
