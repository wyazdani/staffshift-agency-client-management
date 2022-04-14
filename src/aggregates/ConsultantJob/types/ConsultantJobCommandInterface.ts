import {ConsultantJobCommandEnum} from './ConsultantJobCommandEnum';
import {ConsultantJobCommandDataType} from './ConsultantJobCommandDataType';
import {AggregateCommandInterface} from '../../../aggregates/types';
import {ConsultantJobAggregateIdInterface} from '.';

export interface ConsultantJobCommandInterface extends AggregateCommandInterface {
  aggregateId: ConsultantJobAggregateIdInterface;
  type: ConsultantJobCommandEnum;
  data: ConsultantJobCommandDataType;
}
