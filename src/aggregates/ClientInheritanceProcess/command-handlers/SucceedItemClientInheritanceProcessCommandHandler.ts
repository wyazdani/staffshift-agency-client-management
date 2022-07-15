import {EventsEnum} from '../../../Events';
import {ClientInheritanceProcessRepository} from '../ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandHandlerInterface} from '../types/ClientInheritanceProcessCommandHandlerInterface';
import {ClientInheritanceProcessCommandEnum} from '../types';
import {SucceedItemClientInheritanceProcessCommandInterface} from '../types/CommandTypes';
import {AgencyClientInheritanceProcessItemSucceededEventInterface} from 'EventTypes/AgencyClientInheritanceProcessItemSucceededEventInterface';

export class SucceedItemClientInheritanceProcessCommandHandler implements ClientInheritanceProcessCommandHandlerInterface {
  public commandType = ClientInheritanceProcessCommandEnum.SUCCEED_ITEM;

  constructor(private repository: ClientInheritanceProcessRepository) {}

  async execute(command: SucceedItemClientInheritanceProcessCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientInheritanceProcessItemSucceededEventInterface
    ]);
  }
}
