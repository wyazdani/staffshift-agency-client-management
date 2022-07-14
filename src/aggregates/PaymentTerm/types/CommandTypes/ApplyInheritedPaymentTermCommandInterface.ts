import {PaymentTermCommandEnum} from '../PaymentTermCommandEnum';
import {PaymentTermCommandInterface} from '..';

export interface ApplyInheritedPaymentTermCommandDataInterface {
  term: string;
  force: boolean;
}

export interface ApplyInheritedPaymentTermCommandInterface extends PaymentTermCommandInterface {
  type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM;
  data: ApplyInheritedPaymentTermCommandDataInterface;
}
