import {SetFinancialHoldCommandDataInterface, SetInheritedFinancialHoldCommandDataInterface} from './CommandTypes';

export type FinancialHoldCommandDataType =
  | SetFinancialHoldCommandDataInterface
  | SetInheritedFinancialHoldCommandDataInterface;
