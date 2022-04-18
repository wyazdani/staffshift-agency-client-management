import {ConsultantJobProcessCommandEnum} from './ConsultantJobProcessCommandEnum';
import {ConsultantJobProcessCommandDataType} from './ConsultantJobProcessCommandDataType';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {ConsultantJobProcessAggregateIdInterface} from '.';

export interface ConsultantJobProcessCommandInterface extends AggregateCommandInterface {
  aggregateId: ConsultantJobProcessAggregateIdInterface;
  type: ConsultantJobProcessCommandEnum;
  data: ConsultantJobProcessCommandDataType;
}
