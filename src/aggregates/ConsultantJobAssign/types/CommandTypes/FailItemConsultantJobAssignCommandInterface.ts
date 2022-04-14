import {ConsultantJobAssignCommandEnum} from '../ConsultantJobAssignCommandEnum';
import {FailItemConsultantJobAssignCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobAssignCommandInterface} from '..';

export interface FailItemConsultantJobAssignCommandInterface extends ConsultantJobAssignCommandInterface {
  type: ConsultantJobAssignCommandEnum.FAIL_ITEM;
  data: FailItemConsultantJobAssignCommandDataInterface;
}
