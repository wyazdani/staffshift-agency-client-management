import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {CompleteUnassignConsultantCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobCommandInterface} from '..';

export interface CompleteUnassignConsultantCommandInterface extends ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum.COMPLETE_UNASSIGN_CONSULTANT;
  data: CompleteUnassignConsultantCommandDataInterface;
}
