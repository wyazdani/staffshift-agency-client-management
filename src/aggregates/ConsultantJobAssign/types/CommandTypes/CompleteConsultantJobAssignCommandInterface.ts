import {ConsultantJobAssignCommandEnum} from '../ConsultantJobAssignCommandEnum';
import {CompleteConsultantJobAssignCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobAssignCommandInterface} from '..';

export interface CompleteConsultantJobAssignCommandInterface extends ConsultantJobAssignCommandInterface {
  type: ConsultantJobAssignCommandEnum.COMPLETE;
  data: CompleteConsultantJobAssignCommandDataInterface;
}
