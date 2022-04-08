import {ConsultantJobAssignCommandEnum} from '../ConsultantJobAssignCommandEnum';
import {SucceedItemConsultantJobAssignCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobAssignCommandInterface} from '..';

export interface SucceedItemConsultantJobAssignCommandInterface extends ConsultantJobAssignCommandInterface {
  type: ConsultantJobAssignCommandEnum.SUCCEED_ITEM;
  data: SucceedItemConsultantJobAssignCommandDataInterface;
}
