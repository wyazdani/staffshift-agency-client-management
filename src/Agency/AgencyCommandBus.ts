import {AgencyCommand, AgencyCommandHandlerInterface} from './Interfaces';

export class AgencyCommandBus {
    private commandHandlers: AgencyCommandHandlerInterface[] = []

    addHandler(commandHandler: AgencyCommandHandlerInterface) {
        this.commandHandlers.push(commandHandler);
        return this;
    }

    async execute(agencyId: string, command: AgencyCommand): Promise<void> {
        const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);
        if (!commandHandler) {
            throw new Error(`Command type:${command.type} is not supported`);
        }

        await commandHandler.execute(agencyId, command.data);
    }
}