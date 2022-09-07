import {
  SetFinancialHoldCommandDataInterface,
  SetInheritedFinancialHoldCommandDataInterface,
  InheritFinancialHoldClientLinkCommandDataInterface
} from './CommandTypes';

export type FinancialHoldCommandDataType =
  | SetFinancialHoldCommandDataInterface
  | SetInheritedFinancialHoldCommandDataInterface
  | InheritFinancialHoldClientLinkCommandDataInterface;
