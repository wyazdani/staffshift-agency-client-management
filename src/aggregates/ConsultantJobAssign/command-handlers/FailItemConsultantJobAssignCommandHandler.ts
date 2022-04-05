import {ConsultantJobAssignProcessItemFailedEventStoreDataInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {FailItemConsultantJobAssignCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobAssignCommandEnum} from '../types';

export class FailItemConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.FAIL_ITEM;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(
    agencyId: string,
    jobId: string,
    commandData: FailItemConsultantJobAssignCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId, jobId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED,
        aggregate_id: aggregate.getId(),
        data: commandData as ConsultantJobAssignProcessItemFailedEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
