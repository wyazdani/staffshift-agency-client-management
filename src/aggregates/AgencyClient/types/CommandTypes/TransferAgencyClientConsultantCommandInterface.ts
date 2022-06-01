import {AgencyClientCommandInterface} from '../AgencyClientCommandInterface';
import {AgencyClientCommandEnum} from '../AgencyClientCommandEnum';
import {TransferAgencyClientConsultantCommandDataInterface} from '../CommandDataTypes';

export interface TransferAgencyClientConsultantCommandInterface extends AgencyClientCommandInterface {
  type: AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT;
  data: TransferAgencyClientConsultantCommandDataInterface;
}
