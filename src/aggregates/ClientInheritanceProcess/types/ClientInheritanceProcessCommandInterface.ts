import {ClientInheritanceProcessCommandEnum} from './ClientInheritanceProcessCommandEnum';
import {ClientInheritanceProcessCommandDataType} from './ClientInheritanceProcessCommandDataType';
import {AggregateCommandInterface} from '../../types/AggregateCommandInterface';
import {ClientInheritanceProcessAggregateIdInterface} from '.';

export interface ClientInheritanceProcessCommandInterface extends AggregateCommandInterface {
  aggregateId: ClientInheritanceProcessAggregateIdInterface;
  type: ClientInheritanceProcessCommandEnum;
  data: ClientInheritanceProcessCommandDataType;
}
