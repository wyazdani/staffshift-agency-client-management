import {ConsultantJobAssignCommandEnum} from './ConsultantJobAssignCommandEnum';
import {ConsultantJobAssignCommandDataType} from './ConsultantJobAssignCommandDataType';

export interface ConsultantJobAssignCommandInterface {
  type: ConsultantJobAssignCommandEnum;
  data: ConsultantJobAssignCommandDataType;
}
