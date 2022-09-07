import {PaymentTermCommandEnum} from '../PaymentTermCommandEnum';
import {PaymentTermCommandInterface} from '..';

export interface InheritPaymentTermClientLinkCommandDataInterface {
  term: string | null;
}

export interface InheritPaymentTermClientLinkCommandInterface extends PaymentTermCommandInterface {
  type: PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_CLIENT_LINK;
  data: InheritPaymentTermClientLinkCommandDataInterface;
}
