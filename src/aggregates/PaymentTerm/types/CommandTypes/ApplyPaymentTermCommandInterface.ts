import {PaymentTermCommandEnum} from '../PaymentTermCommandEnum';
import {PaymentTermCommandInterface} from '..';

export interface ApplyPaymentTermCommandDataInterface {
  term: string;
}

export interface ApplyPaymentTermCommandInterface extends PaymentTermCommandInterface {
  type: PaymentTermCommandEnum.APPLY_PAYMENT_TERM;
  data: ApplyPaymentTermCommandDataInterface;
}
