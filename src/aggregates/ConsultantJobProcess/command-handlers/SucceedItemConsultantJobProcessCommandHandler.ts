import {EventsEnum} from '../../../Events';
import {ConsultantJobProcessRepository} from '../ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandHandlerInterface} from '../types/ConsultantJobProcessCommandHandlerInterface';
import {ConsultantJobProcessCommandEnum} from '../types';
import {SucceedItemConsultantJobProcessCommandInterface} from '../types/CommandTypes';
import {ConsultantJobProcessItemSucceededEventInterface} from 'EventTypes/ConsultantJobProcessItemSucceededEventInterface';

export class SucceedItemConsultantJobProcessCommandHandler implements ConsultantJobProcessCommandHandlerInterface {
  public commandType = ConsultantJobProcessCommandEnum.SUCCEED_ITEM;

  constructor(private repository: ConsultantJobProcessRepository) {}

  async execute(command: SucceedItemConsultantJobProcessCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobProcessItemSucceededEventInterface
    ]);
    return eventId;
  }
}
