import {ConsultantJobAssignCommandDataType} from './ConsultantJobAssignCommandDataType';

export interface ConsultantJobAssignCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, jobId: string, commandData: ConsultantJobAssignCommandDataType): Promise<void>;
}
