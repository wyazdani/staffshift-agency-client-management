import {UnassignConsultantCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {ConsultantJobCommandInterface} from '..';

export interface UnassignConsultantCommandInterface extends ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum.UNASSIGN_CONSULTANT;
  data: UnassignConsultantCommandDataInterface;
}
