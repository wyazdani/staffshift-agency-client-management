import {FinancialHoldCommandEnum} from '../FinancialHoldCommandEnum';
import {FinancialHoldCommandInterface} from '..';

export interface SetInheritedFinancialHoldCommandDataInterface {
  financial_hold: boolean | null;
  force: boolean;
  /* optional since when financial_hold is set to `null` in the command, we don't have any note */
  note?: string;
}

export interface SetInheritedFinancialHoldCommandInterface extends FinancialHoldCommandInterface {
  type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD;
  data: SetInheritedFinancialHoldCommandDataInterface;
}
