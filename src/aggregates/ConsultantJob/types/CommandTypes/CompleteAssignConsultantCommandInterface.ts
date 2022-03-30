import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {CompleteAssignConsultantCommandDataInterface} from '../CommandDataTypes';

export interface CompleteAssignConsultantCommandInterface {
  type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT;
  data: CompleteAssignConsultantCommandDataInterface;
}
