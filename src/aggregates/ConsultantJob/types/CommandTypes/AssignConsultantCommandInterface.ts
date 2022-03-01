import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {AssignConsultantCommandDataInterface} from '../CommandDataTypes';

export interface AssignConsultantCommandInterface {
  type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT;
  data: AssignConsultantCommandDataInterface;
}
