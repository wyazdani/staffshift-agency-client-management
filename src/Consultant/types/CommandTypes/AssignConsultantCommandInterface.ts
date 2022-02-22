import {ConsultantCommandEnum} from '../ConsultantCommandEnum';
import {AssignConsultantCommandDataInterface} from '../CommandDataTypes';

export interface AssignConsultantCommandInterface {
  type: ConsultantCommandEnum.ASSIGN_CONSULTANT;
  data: AssignConsultantCommandDataInterface;
}
