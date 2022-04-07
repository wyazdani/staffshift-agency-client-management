import {AgencyCommandHandlerInterface} from './types/AgencyCommandHandlerInterface';
import {AgencyCommandInterface} from './types';
import {
  AddAgencyConsultantRoleCommandHandler,
  UpdateAgencyConsultantRoleCommandHandler,
  EnableAgencyConsultantRoleCommandHandler,
  DisableAgencyConsultantRoleCommandHandler,
  AddAgencyConsultantRoleCommandHandlerNeil
} from './command-handlers';
import {AgencyRepository} from './AgencyRepository';
import {EventRepository} from '../../EventRepository';
import {AgencyWriteProjectionHandler} from './AgencyWriteProjectionHandler';
import {AggregateCommandBusInterface} from '../AggregateCommandBusInterface';
import {AggregateCommandInterface} from '../AggregateCommandInterface';
import {CommandBus} from '../CommandBus';
import {AggregateCommandHandlerInterface} from '../AggregateCommandHandlerInterface';

const handlers = [AddAgencyConsultantRoleCommandHandlerNeil];

/**
 * Responsible for routing all agency related commands to their corresponding handlers
 */
export class AgencyCommandBus implements AggregateCommandBusInterface {
  private commandHandlers: AgencyCommandHandlerInterface[] = [];

  static registerCommandHandlers(eventRepository: EventRepository, commandBus: CommandBus) {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());

    for (const item of handlers) {
      commandBus.registerAggregateCommand(new item(agencyRepository));
    }
  }

  /**
   * Returns an instance of AgencyCommandBus with a list of supported command handlers configured
   */
  static getCommandBus(eventRepository: EventRepository): AgencyCommandBus {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const commandBus = new AgencyCommandBus();

    commandBus
      .addHandler(new AddAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new UpdateAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new EnableAgencyConsultantRoleCommandHandler(agencyRepository))
      .addHandler(new DisableAgencyConsultantRoleCommandHandler(agencyRepository));
    return commandBus;
  }

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
  async run(command: AggregateCommandInterface): Promise<void> {
    const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);

    if (!commandHandler) {
      throw new Error(`Command type:${command.type} is not supported`);
    }
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
