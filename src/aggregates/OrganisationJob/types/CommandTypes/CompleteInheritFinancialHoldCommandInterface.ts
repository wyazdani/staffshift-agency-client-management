import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface CompleteInheritFinancialHoldCommandDataInterface {
  _id: string;
}

export interface CompleteInheritFinancialHoldCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD;
  data: CompleteInheritFinancialHoldCommandDataInterface;
}
