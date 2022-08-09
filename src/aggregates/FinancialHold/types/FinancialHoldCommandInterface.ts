import {FinancialHoldCommandEnum} from './FinancialHoldCommandEnum';
import {FinancialHoldCommandDataType} from './FinancialHoldCommandDataType';
import {AggregateCommandInterface} from '../../types';
import {FinancialHoldAggregateIdInterface} from '.';

export interface FinancialHoldCommandInterface extends AggregateCommandInterface {
  aggregateId: FinancialHoldAggregateIdInterface;
  type: FinancialHoldCommandEnum;
  data: FinancialHoldCommandDataType;
}
