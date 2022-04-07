import {AgencyClientCommandEnum} from './AgencyClientCommandEnum';
import {AgencyClientCommandDataType} from './AgencyClientCommandDataType';
import {AggregateCommandInterface} from '../../types';

export interface AgencyClientCommandInterface extends AggregateCommandInterface {
  type: AgencyClientCommandEnum;
  data: AgencyClientCommandDataType;
}
