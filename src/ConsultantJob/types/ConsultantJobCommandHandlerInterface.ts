import {ConsultantJobCommandDataType} from './ConsultantJobCommandDataType';

export interface ConsultantJobCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, commandData: ConsultantJobCommandDataType): Promise<void>;
}
