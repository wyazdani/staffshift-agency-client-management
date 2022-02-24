import {ConsultantJobCommandEnum} from './ConsultantJobCommandEnum';
import {ConsultantJobCommandDataType} from './ConsultantJobCommandDataType';

export interface ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum;
  data: ConsultantJobCommandDataType;
}
