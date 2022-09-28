import {EventsEnum} from '../../../Events';
import {ConsultantJobProcessRepository} from '../ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandHandlerInterface} from '../types/ConsultantJobProcessCommandHandlerInterface';
import {ConsultantJobProcessCommandEnum} from '../types';
import {StartConsultantJobProcessCommandInterface} from '../types/CommandTypes';
import {ConsultantJobProcessStartedEventInterface} from 'EventTypes/ConsultantJobProcessStartedEventInterface';

export class StartConsultantJobProcessCommandHandler implements ConsultantJobProcessCommandHandlerInterface {
  public commandType = ConsultantJobProcessCommandEnum.START;

  constructor(private repository: ConsultantJobProcessRepository) {}

  async execute(command: StartConsultantJobProcessCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_PROCESS_STARTED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobProcessStartedEventInterface
    ]);
    return eventId;
  }
}
