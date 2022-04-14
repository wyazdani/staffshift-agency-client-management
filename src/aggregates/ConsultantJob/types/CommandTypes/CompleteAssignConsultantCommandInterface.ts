import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {CompleteAssignConsultantCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobCommandInterface} from '..';

export interface CompleteAssignConsultantCommandInterface extends ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT;
  data: CompleteAssignConsultantCommandDataInterface;
}
