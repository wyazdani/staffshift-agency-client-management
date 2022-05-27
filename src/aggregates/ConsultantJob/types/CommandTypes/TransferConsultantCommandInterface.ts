import {TransferConsultantCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobCommandEnum} from '../ConsultantJobCommandEnum';
import {ConsultantJobCommandInterface} from '../ConsultantJobCommandInterface';

export interface TransferConsultantCommandInterface extends ConsultantJobCommandInterface {
  type: ConsultantJobCommandEnum.TRANSFER_CONSULTANT;
  data: TransferConsultantCommandDataInterface;
}
