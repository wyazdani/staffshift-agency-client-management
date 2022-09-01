import {FinancialHoldCommandEnum} from '../FinancialHoldCommandEnum';
import {FinancialHoldCommandInterface} from '..';

export interface InheritFinancialHoldClientLinkCommandDataInterface {
  financial_hold: boolean | null;
  note?: string;
}

export interface InheritFinancialHoldClientLinkCommandInterface extends FinancialHoldCommandInterface {
  type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK;
  data: InheritFinancialHoldClientLinkCommandDataInterface;
}
