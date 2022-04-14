import {ConsultantJobAssignCommandInterface} from '.';

export interface ConsultantJobAssignCommandHandlerInterface {
  commandType: string;
  execute(command: ConsultantJobAssignCommandInterface): Promise<void>;
}
