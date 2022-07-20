import {EventsEnum} from '../../../Events';
import {ClientInheritanceProcessRepository} from '../ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandHandlerInterface} from '../types/ClientInheritanceProcessCommandHandlerInterface';
import {ClientInheritanceProcessCommandEnum} from '../types';
import {CompleteClientInheritanceProcessCommandInterface} from '../types/CommandTypes';
import {AgencyClientInheritanceProcessCompletedEventInterface} from 'EventTypes/AgencyClientInheritanceProcessCompletedEventInterface';

export class CompleteClientInheritanceProcessCommandHandler implements ClientInheritanceProcessCommandHandlerInterface {
  public commandType = ClientInheritanceProcessCommandEnum.COMPLETE_INHERITANCE_PROCESS;

  constructor(private repository: ClientInheritanceProcessRepository) {}

  async execute(command: CompleteClientInheritanceProcessCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientInheritanceProcessCompletedEventInterface
    ]);
  }
}
