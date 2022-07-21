import {PaymentTermCommandEnum} from './PaymentTermCommandEnum';
import {PaymentTermCommandDataType} from './PaymentTermCommandDataType';
import {AggregateCommandInterface} from '../../types';
import {PaymentTermAggregateIdInterface} from '.';

export interface PaymentTermCommandInterface extends AggregateCommandInterface {
  aggregateId: PaymentTermAggregateIdInterface;
  type: PaymentTermCommandEnum;
  data: PaymentTermCommandDataType;
}
