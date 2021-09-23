import {AgencyCommandEnum} from './AgencyCommandEnum';
import {AgencyCommandDataType} from './AgencyCommandDataType';

export interface AgencyCommandInterface {
  type: AgencyCommandEnum;
  data: AgencyCommandDataType;
}
