import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {AssignConsultantCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobCommandInterface} from '..';

export interface AssignConsultantCommandInterface extends ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT;
  data: AssignConsultantCommandDataInterface;
}
