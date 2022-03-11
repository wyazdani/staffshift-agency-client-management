import {ConsultantJobAssignProcessProgressedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {ProgressConsultantJobAssignCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobAssignCommandEnum} from '../types';

export class ProgressConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.PROGRESS;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(
    agencyId: string,
    jobId: string,
    commandData: ProgressConsultantJobAssignCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId, jobId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_PROGRESSED,
        aggregate_id: aggregate.getId(),
        data: commandData as ConsultantJobAssignProcessProgressedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
