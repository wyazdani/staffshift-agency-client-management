import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteInheritPaymentTermCommandDataInterface {
  _id: string;
}

export interface CompleteInheritPaymentTermCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_INHERIT_PAYMENT_TERM;
  data: CompleteInheritPaymentTermCommandDataInterface;
}
