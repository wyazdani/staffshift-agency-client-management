import {ConsultantJobRepository} from '../ConsultantJobRepository';
import {ConsultantJobCommandHandlerInterface} from '../types/ConsultantJobCommandHandlerInterface';
import {ConsultantJobCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {UnassignConsultantCommandInterface} from '../types/CommandTypes';
import {ConsultantJobUnassignInitiatedEventInterface} from 'EventTypes/ConsultantJobUnassignInitiatedEventInterface';

export class UnassignConsultantCommandHandler implements ConsultantJobCommandHandlerInterface {
  public commandType = ConsultantJobCommandEnum.UNASSIGN_CONSULTANT;

  constructor(private repository: ConsultantJobRepository) {}

  async execute(command: UnassignConsultantCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateUnassignConsultant(command.data);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as ConsultantJobUnassignInitiatedEventInterface
    ]);
    return eventId;
  }
}
