import {EventsEnum} from '../../../Events';
import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {ConsultantJobAssignCommandEnum} from '../types';
import {ConsultantJobAssignProcessItemFailedEventInterface} from 'EventTypes/ConsultantJobAssignProcessItemFailedEventInterface';
import {FailItemConsultantJobAssignCommandInterface} from '../types/CommandTypes/FailItemConsultantJobAssignCommandInterface';

export class FailItemConsultantJobAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.FAIL_ITEM;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(command: FailItemConsultantJobAssignCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let eventId = aggregate.getLastEventId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobAssignProcessItemFailedEventInterface
    ]);
  }
}
