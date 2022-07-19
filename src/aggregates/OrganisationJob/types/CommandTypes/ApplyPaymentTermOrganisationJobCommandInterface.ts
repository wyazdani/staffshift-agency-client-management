import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface ApplyPaymentTermOrganisationJobCommandDataInterface {
  _id: string;
  term: string;
}

export interface ApplyPaymentTermOrganisationJobCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.APPLY_PAYMENT_TERM;
  data: ApplyPaymentTermOrganisationJobCommandDataInterface;
}
