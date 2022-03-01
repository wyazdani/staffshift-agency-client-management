import {ConsultantJobAssignRepository} from '../ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandHandlerInterface} from '../types/ConsultantJobAssignCommandHandlerInterface';
import {StartConsultantJobAssignCommandDataInterface} from '../types/CommandDataTypes';
import {ConsultantJobAssignCommandEnum} from '../types';

export class StartConsultantAssignCommandHandler implements ConsultantJobAssignCommandHandlerInterface {
  public commandType = ConsultantJobAssignCommandEnum.START;

  constructor(private repository: ConsultantJobAssignRepository) {}

  async execute(agencyId: string, jobId: string, commandData: StartConsultantJobAssignCommandDataInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(agencyId, jobId);

    let eventId = aggregate.getLastEventId();

    // will be implemented in next prs
    // await this.repository.save([
    //   {
    //   }
    // ]);
  }
}
