import {ConsultantJobAssignCommandEnum} from './ConsultantJobAssignCommandEnum';
import {ConsultantJobAssignCommandDataType} from './ConsultantJobAssignCommandDataType';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {ConsultantJobAssignAggregateIdInterface} from '.';

export interface ConsultantJobAssignCommandInterface extends AggregateCommandInterface {
  aggregateId: ConsultantJobAssignAggregateIdInterface;
  type: ConsultantJobAssignCommandEnum;
  data: ConsultantJobAssignCommandDataType;
}
