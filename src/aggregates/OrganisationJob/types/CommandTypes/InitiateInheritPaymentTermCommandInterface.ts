import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface InitiateInheritPaymentTermCommandDataInterface {
  _id: string;
}

export interface InitiateInheritPaymentTermCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.INHERIT_PAYMENT_TERM;
  data: InitiateInheritPaymentTermCommandDataInterface;
}
