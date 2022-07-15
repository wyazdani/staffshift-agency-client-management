import {EventsEnum} from '../../../Events';
import {ClientInheritanceProcessRepository} from '../ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandHandlerInterface} from '../types/ClientInheritanceProcessCommandHandlerInterface';
import {ClientInheritanceProcessCommandEnum} from '../types';
import {StartClientInheritanceProcessCommandInterface} from '../types/CommandTypes';
import {AgencyClientInheritanceProcessStartedEventInterface} from 'EventTypes/AgencyClientInheritanceProcessStartedEventInterface';

export class StartClientInheritanceProcessCommandHandler implements ClientInheritanceProcessCommandHandlerInterface {
  public commandType = ClientInheritanceProcessCommandEnum.START;

  constructor(private repository: ClientInheritanceProcessRepository) {}

  async execute(command: StartClientInheritanceProcessCommandInterface): Promise<void> {
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
  }
}
