import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface InheritPaymentTermOrganisationJobCommandDataInterface {
  _id: string;
}

export interface InheritPaymentTermOrganisationJobCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.INHERIT_PAYMENT_TERM;
  data: InheritPaymentTermOrganisationJobCommandDataInterface;
}
