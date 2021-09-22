import {AgencyCommand, AgencyCommandHandlerInterface} from './Interfaces';
import {AgencyRepository} from "./AgencyRepository";

export class AgencyCommandBus {
    private commandHandlers: AgencyCommandHandlerInterface[] = []

    constructor(private agencyRepository: AgencyRepository) {}

    addHandler(commandHandler: AgencyCommandHandlerInterface) {
        this.commandHandlers.push(commandHandler);
        return this;
    }

    async execute(agencyId: string, command: AgencyCommand): Promise<void> {
        const commandHandler = this.commandHandlers.find((handler) => handler.commandType === command.type);
        if (!commandHandler) {
            throw new Error(`Command type:${command.type} is not supported`);
        }

        const aggregate = await this.agencyRepository.getAggregate(agencyId);
        const newEvents = await commandHandler.execute(aggregate, command.data);
        await this.agencyRepository.save(newEvents);
    }
}