import {EventsEnum} from '../../../Events';
import {ConsultantJobProcessRepository} from '../ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandHandlerInterface} from '../types/ConsultantJobProcessCommandHandlerInterface';
import {ConsultantJobProcessCommandEnum} from '../types';
import {CompleteConsultantJobProcessCommandInterface} from '../types/CommandTypes/CompleteConsultantJobProcessCommandInterface';
import {ConsultantJobProcessCompletedEventInterface} from 'EventTypes/ConsultantJobProcessCompletedEventInterface';

export class CompleteConsultantJobProcessCommandHandler implements ConsultantJobProcessCommandHandlerInterface {
  public commandType = ConsultantJobProcessCommandEnum.COMPLETE;

  constructor(private repository: ConsultantJobProcessRepository) {}

  async execute(command: CompleteConsultantJobProcessCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_PROCESS_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobProcessCompletedEventInterface
    ]);
    return eventId;
  }
}
