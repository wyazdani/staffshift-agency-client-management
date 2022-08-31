import {PaymentTermCommandEnum} from '../PaymentTermCommandEnum';
import {PaymentTermCommandInterface} from '..';

export interface InheritPaymentTermForNewClientLinkCommandDataInterface {
  term: string | null;
}

export interface InheritPaymentTermForNewClientLinkCommandInterface extends PaymentTermCommandInterface {
  type: PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_FOR_NEW_CLIENT_LINK;
  data: InheritPaymentTermForNewClientLinkCommandDataInterface;
}
