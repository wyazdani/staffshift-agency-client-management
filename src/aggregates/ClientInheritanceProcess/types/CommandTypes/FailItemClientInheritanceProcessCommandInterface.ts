import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {ClientInheritanceProcessCommandEnum} from '../ClientInheritanceProcessCommandEnum';
import {ClientInheritanceProcessCommandInterface} from '..';

export interface FailItemClientInheritanceProcessCommandDataInterface {
  client_id: string;
  errors: EventStoreEncodedErrorInterface[];
}

export interface FailItemClientInheritanceProcessCommandInterface extends ClientInheritanceProcessCommandInterface {
  type: ClientInheritanceProcessCommandEnum.FAIL_ITEM_INHERITANCE_PROCESS;
  data: FailItemClientInheritanceProcessCommandDataInterface;
}
