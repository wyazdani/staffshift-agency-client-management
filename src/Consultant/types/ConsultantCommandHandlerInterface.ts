import {ConsultantCommandDataType} from './ConsultantCommandDataType';

export interface ConsultantCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, commandData: ConsultantCommandDataType): Promise<void>;
}
