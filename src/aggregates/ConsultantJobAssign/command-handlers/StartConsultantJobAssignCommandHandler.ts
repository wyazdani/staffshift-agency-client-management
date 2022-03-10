import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {StartConsultantJobAssignCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobAssignCommandEnum} from '../types';

export class StartConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.START;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(
    agencyId: string,
    jobId: string,
    commandData: StartConsultantJobAssignCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId, jobId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_STARTED,
        aggregate_id: aggregate.getId(),
        data: commandData as StartConsultantJobAssignCommandDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
