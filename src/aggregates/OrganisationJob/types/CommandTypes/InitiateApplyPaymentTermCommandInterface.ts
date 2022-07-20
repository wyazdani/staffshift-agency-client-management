import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface InitiateApplyPaymentTermCommandDataInterface {
  _id: string;
  term: string;
  client_id:string;
}

export interface InitiateApplyPaymentTermCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.APPLY_PAYMENT_TERM;
  data: InitiateApplyPaymentTermCommandDataInterface;
}
