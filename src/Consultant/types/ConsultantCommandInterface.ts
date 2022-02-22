import {ConsultantCommandEnum} from './ConsultantCommandEnum';
import {ConsultantCommandDataType} from './ConsultantCommandDataType';

export interface ConsultantCommandInterface {
  type: ConsultantCommandEnum;
  data: ConsultantCommandDataType;
}
