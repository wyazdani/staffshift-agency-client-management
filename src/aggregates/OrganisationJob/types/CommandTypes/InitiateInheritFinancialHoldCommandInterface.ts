import {OrganisationJobCommandEnum} from '../OrganisationJobCommandEnum';
import {OrganisationJobCommandInterface} from '../OrganisationJobCommandInterface';

export interface InitiateInheritFinancialHoldCommandDataInterface {
  _id: string;
  client_id: string;
}

export interface InitiateInheritFinancialHoldCommandInterface extends OrganisationJobCommandInterface {
  type: OrganisationJobCommandEnum.INITIATE_INHERIT_FINANCIAL_HOLD;
  data: InitiateInheritFinancialHoldCommandDataInterface;
}
