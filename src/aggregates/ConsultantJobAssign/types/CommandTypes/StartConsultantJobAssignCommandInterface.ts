import {ConsultantJobAssignCommandEnum} from '../ConsultantJobAssignCommandEnum';
import {StartConsultantJobAssignCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobAssignCommandInterface} from '..';

export interface StartConsultantJobAssignCommandInterface extends ConsultantJobAssignCommandInterface {
  type: ConsultantJobAssignCommandEnum.START;
  data: StartConsultantJobAssignCommandDataInterface;
}
