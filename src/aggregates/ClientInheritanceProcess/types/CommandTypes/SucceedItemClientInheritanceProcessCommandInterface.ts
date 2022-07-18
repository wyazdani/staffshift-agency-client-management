import {ClientInheritanceProcessCommandEnum} from '../ClientInheritanceProcessCommandEnum';
import {ClientInheritanceProcessCommandInterface} from '..';

export interface SucceedItemClientInheritanceProcessCommandDataInterface {
  client_id: string;
}

export interface SucceedItemClientInheritanceProcessCommandInterface extends ClientInheritanceProcessCommandInterface {
  type: ClientInheritanceProcessCommandEnum.SUCCEED_ITEM_INHERITANCE_PROCESS;
  data: SucceedItemClientInheritanceProcessCommandDataInterface;
}
