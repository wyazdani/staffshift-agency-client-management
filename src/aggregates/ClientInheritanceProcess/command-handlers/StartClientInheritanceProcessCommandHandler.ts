import {EventsEnum} from '../../../Events';
import {ClientInheritanceProcessRepository} from '../ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandHandlerInterface} from '../types/ClientInheritanceProcessCommandHandlerInterface';
import {ClientInheritanceProcessCommandEnum} from '../types';
import {StartClientInheritanceProcessCommandInterface} from '../types/CommandTypes';
import {AgencyClientInheritanceProcessStartedEventInterface} from 'EventTypes/AgencyClientInheritanceProcessStartedEventInterface';

export class StartClientInheritanceProcessCommandHandler implements ClientInheritanceProcessCommandHandlerInterface {
  public commandType = ClientInheritanceProcessCommandEnum.START_INHERITANCE_PROCESS;

  constructor(private repository: ClientInheritanceProcessRepository) {}

  async execute(command: StartClientInheritanceProcessCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientInheritanceProcessStartedEventInterface
    ]);
    return eventId;
  }
}
