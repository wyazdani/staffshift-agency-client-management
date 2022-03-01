import {AgencyClientCommandEnum} from './AgencyClientCommandEnum';
import {AgencyClientCommandDataType} from './AgencyClientCommandDataType';

export interface AgencyClientCommandInterface {
  type: AgencyClientCommandEnum;
  data: AgencyClientCommandDataType;
}
