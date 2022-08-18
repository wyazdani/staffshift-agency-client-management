import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteApplyFinancialHoldCommandDataInterface {
  _id: string;
}

export interface CompleteApplyFinancialHoldCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_APPLY_FINANCIAL_HOLD;
  data: CompleteApplyFinancialHoldCommandDataInterface;
}
