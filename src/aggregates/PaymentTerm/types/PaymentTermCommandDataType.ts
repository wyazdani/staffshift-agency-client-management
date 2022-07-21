import {ApplyPaymentTermCommandDataInterface, ApplyInheritedPaymentTermCommandDataInterface} from './CommandTypes';

export type PaymentTermCommandDataType =
  | ApplyPaymentTermCommandDataInterface
  | ApplyInheritedPaymentTermCommandDataInterface;
