import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface InitiateApplyFinancialHoldCommandDataInterface {
  _id: string;
  client_id: string;
  note: string;
}

export interface InitiateApplyFinancialHoldCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.INITIATE_APPLY_FINANCIAL_HOLD;
  data: InitiateApplyFinancialHoldCommandDataInterface;
}
