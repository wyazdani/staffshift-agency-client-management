import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface InitiateClearFinancialHoldCommandDataInterface {
  _id: string;
  client_id: string;
  note: string;
}

export interface InitiateClearFinancialHoldCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.INITIATE_CLEAR_FINANCIAL_HOLD;
  data: InitiateClearFinancialHoldCommandDataInterface;
}
