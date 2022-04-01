import {ConsultantJobAssignCompletedEventStoreDataInterface} from 'EventTypes';
import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {CompleteAssignConsultantCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';

export class CompleteAssignConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(agencyId: string, commandData: CompleteAssignConsultantCommandDataInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId);

    if (aggregate.validateCompleteJob(commandData._id)) {
      let eventId = aggregate.getLastEventId();

      await this.repository.save([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: commandData as ConsultantJobAssignCompletedEventStoreDataInterface,
          sequence_id: ++eventId
        }
      ]);
    }
  }
}
