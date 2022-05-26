import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {CompleteTransferConsultantCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobCommandInterface} from '../ConsultantJobCommandInterface';

export interface CompleteTransferConsultantCommandInterface extends ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum.COMPLETE_TRANSFER_CONSULTANT;
  data: CompleteTransferConsultantCommandDataInterface;
}
