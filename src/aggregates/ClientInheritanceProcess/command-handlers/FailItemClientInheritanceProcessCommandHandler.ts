import {EventsEnum} from '../../../Events';
import {ClientInheritanceProcessRepository} from '../ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandHandlerInterface} from '../types/ClientInheritanceProcessCommandHandlerInterface';
import {ClientInheritanceProcessCommandEnum} from '../types';
import {AgencyClientInheritanceProcessItemFailedEventInterface} from 'EventTypes/AgencyClientInheritanceProcessItemFailedEventInterface';
import {FailItemClientInheritanceProcessCommandInterface} from '../types/CommandTypes';

export class FailItemClientInheritanceProcessCommandHandler implements ClientInheritanceProcessCommandHandlerInterface {
  public commandType = ClientInheritanceProcessCommandEnum.FAIL_ITEM_INHERITANCE_PROCESS;

  constructor(private repository: ClientInheritanceProcessRepository) {}

  async execute(command: FailItemClientInheritanceProcessCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientInheritanceProcessItemFailedEventInterface
    ]);
  }
}
