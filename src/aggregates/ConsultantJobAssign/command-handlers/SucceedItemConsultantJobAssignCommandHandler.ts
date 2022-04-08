import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {ConsultantJobAssignCommandEnum} from '../types';
import {SucceedItemConsultantJobAssignCommandInterface} from '../types/CommandTypes/SucceedItemConsultantJobAssignCommandInterface';
import {ConsultantJobAssignProcessItemSucceededEventInterface} from 'EventTypes/ConsultantJobAssignProcessItemSucceededEventInterface';

export class SucceedItemConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.SUCCEED_ITEM;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(command: SucceedItemConsultantJobAssignCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_SUCCEEDED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobAssignProcessItemSucceededEventInterface
    ]);
  }
}
