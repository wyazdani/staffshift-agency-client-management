import {FinancialHoldCommandEnum} from '../FinancialHoldCommandEnum';
import {FinancialHoldCommandInterface} from '..';

export interface SetInheritedFinancialHoldCommandDataInterface {
  financial_hold: boolean | null;
  force: boolean;
  note: string;
}

export interface SetInheritedFinancialHoldCommandInterface extends FinancialHoldCommandInterface {
  type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD;
  data: SetInheritedFinancialHoldCommandDataInterface;
}
