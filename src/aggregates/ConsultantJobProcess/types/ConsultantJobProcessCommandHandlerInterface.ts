import {ConsultantJobProcessCommandInterface} from '.';

export interface ConsultantJobProcessCommandHandlerInterface {
  commandType: string;
  execute(command: ConsultantJobProcessCommandInterface): Promise<void>;
}
