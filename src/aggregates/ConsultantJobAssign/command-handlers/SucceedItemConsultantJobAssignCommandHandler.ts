import {ConsultantJobAssignProcessItemSucceededEventStoreDataInterface} from 'EventStoreDataTypes';
import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {SucceedItemConsultantJobAssignCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobAssignCommandEnum} from '../types';

export class SucceedItemConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.SUCCEED_ITEM;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(
    agencyId: string,
    jobId: string,
    commandData: SucceedItemConsultantJobAssignCommandDataInterface
  ): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId, jobId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_SUCCEEDED,
        aggregate_id: aggregate.getId(),
        data: commandData as ConsultantJobAssignProcessItemSucceededEventStoreDataInterface,
        sequence_id: ++eventId
      }
    ]);
  }
}
