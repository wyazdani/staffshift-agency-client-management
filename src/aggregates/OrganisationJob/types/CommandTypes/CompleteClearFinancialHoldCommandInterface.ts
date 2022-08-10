import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteClearFinancialHoldCommandDataInterface {
  _id: string;
}

export interface CompleteClearFinancialHoldCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_CLEAR_FINANCIAL_HOLD;
  data: CompleteClearFinancialHoldCommandDataInterface;
}
