import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteApplyPaymentTermOrganisationJobCommandDataInterface {
  _id: string;
}

export interface CompleteApplyPaymentTermOrganisationJobCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM;
  data: CompleteApplyPaymentTermOrganisationJobCommandDataInterface;
}
