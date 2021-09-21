import {GenericObjectInterface} from 'GenericObjectInterface';
import {AgencyCommandEnum} from './AgencyCommandEnum';

export interface AgencyCommandInterface {
  type: AgencyCommandEnum;
  data: GenericObjectInterface;
}
