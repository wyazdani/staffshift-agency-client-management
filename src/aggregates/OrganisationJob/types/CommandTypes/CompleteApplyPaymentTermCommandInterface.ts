import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteApplyPaymentTermCommandDataInterface {
  _id: string;
}

export interface CompleteApplyPaymentTermCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM;
  data: CompleteApplyPaymentTermCommandDataInterface;
}
