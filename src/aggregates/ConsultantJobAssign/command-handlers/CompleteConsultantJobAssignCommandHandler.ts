import {ConsultantJobAssignProcessCompletedEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {CompleteConsultantJobAssignCommandDataInterface
} from '../types/CommandDataTypes';
import {ConsultantJobAssignCommandEnum} from '../types';

export class CompleteConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.COMPLETE;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(
    agencyId: string,
    jobId: string,
    commandData: CompleteConsultantJobAssignCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId, jobId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: commandData as ConsultantJobAssignProcessCompletedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
