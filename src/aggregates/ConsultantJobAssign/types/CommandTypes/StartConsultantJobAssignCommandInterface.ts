import {ConsultantJobAssignCommandEnum} from '../ConsultantJobAssignCommandEnum';
import {StartConsultantJobAssignCommandDataInterface} from '../CommandDataTypes';

export interface StartConsultantJobAssignCommandInterface {
  type: ConsultantJobAssignCommandEnum.START;
  data: StartConsultantJobAssignCommandDataInterface;
}
