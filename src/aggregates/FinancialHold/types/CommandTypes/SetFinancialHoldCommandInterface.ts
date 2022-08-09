import {FinancialHoldCommandEnum} from '../FinancialHoldCommandEnum';
import {FinancialHoldCommandInterface} from '..';

export interface SetFinancialHoldCommandDataInterface {
  financial_hold: boolean;
  note: string;
}

export interface SetFinancialHoldCommandInterface extends FinancialHoldCommandInterface {
  type: FinancialHoldCommandEnum.SET_FINANCIAL_HOLD;
  data: SetFinancialHoldCommandDataInterface;
}
