import {ConsultantJobCommandInterface} from '.';

export interface ConsultantJobCommandHandlerInterface {
  commandType: string;
  execute(command: ConsultantJobCommandInterface): Promise<number>;
}
