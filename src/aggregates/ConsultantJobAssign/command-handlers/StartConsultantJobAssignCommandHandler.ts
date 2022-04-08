import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {ConsultantJobAssignCommandEnum} from '../types';
import {StartConsultantJobAssignCommandInterface} from '../types/CommandTypes';
import {ConsultantJobAssignProcessStartedEventInterface} from 'EventTypes/ConsultantJobAssignProcessStartedEventInterface';

export class StartConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.START;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(command: StartConsultantJobAssignCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_STARTED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobAssignProcessStartedEventInterface
    ]);
  }
}
