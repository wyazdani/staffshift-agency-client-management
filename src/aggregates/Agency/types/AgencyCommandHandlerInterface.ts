import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyCommandHandlerInterface {
  commandType: string;
  execute(agencyId: string, commandData: AgencyCommandDataType): Promise<void>;
}
