import {ClientInheritanceProcessCommandEnum} from '../ClientInheritanceProcessCommandEnum';
import {ClientInheritanceProcessCommandInterface} from '..';

export interface StartClientInheritanceProcessCommandDataInterface {
  estimated_count: number;
}

export interface StartClientInheritanceProcessCommandInterface extends ClientInheritanceProcessCommandInterface {
  type: ClientInheritanceProcessCommandEnum.START_INHERITANCE_PROCESS;
  data: StartClientInheritanceProcessCommandDataInterface;
}
