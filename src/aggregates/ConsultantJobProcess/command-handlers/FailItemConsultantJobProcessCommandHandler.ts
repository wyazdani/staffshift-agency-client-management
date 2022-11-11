import {EventsEnum} from '../../../Events';
import {ConsultantJobProcessRepository} from '../ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandHandlerInterface} from '../types/ConsultantJobProcessCommandHandlerInterface';
import {ConsultantJobProcessCommandEnum} from '../types';
import {ConsultantJobProcessItemFailedEventInterface} from 'EventTypes/ConsultantJobProcessItemFailedEventInterface';
import {FailItemConsultantJobProcessCommandInterface} from '../types/CommandTypes';

export class FailItemConsultantJobProcessCommandHandler implements ConsultantJobProcessCommandHandlerInterface {
  public commandType = ConsultantJobProcessCommandEnum.FAIL_ITEM;

  constructor(private repository: ConsultantJobProcessRepository) {}

  async execute(command: FailItemConsultantJobProcessCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_FAILED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobProcessItemFailedEventInterface
    ]);
    return eventId;
  }
}
