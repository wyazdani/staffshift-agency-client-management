import {ClientInheritanceProcessCommandEnum} from '../ClientInheritanceProcessCommandEnum';
import {ClientInheritanceProcessCommandInterface} from '..';

export interface CompleteClientInheritanceProcessCommandDataInterface {}

export interface CompleteClientInheritanceProcessCommandInterface extends ClientInheritanceProcessCommandInterface {
  type: ClientInheritanceProcessCommandEnum.COMPLETE_INHERITANCE_PROCESS;
  data: CompleteClientInheritanceProcessCommandDataInterface;
}
