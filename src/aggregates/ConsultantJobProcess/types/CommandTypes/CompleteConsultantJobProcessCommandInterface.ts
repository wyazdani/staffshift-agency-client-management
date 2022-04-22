import {ConsultantJobProcessCommandEnum} from '../ConsultantJobProcessCommandEnum';
import {CompleteConsultantJobProcessCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobProcessCommandInterface} from '..';

export interface CompleteConsultantJobProcessCommandInterface extends ConsultantJobProcessCommandInterface {
  type: ConsultantJobProcessCommandEnum.COMPLETE;
  data: CompleteConsultantJobProcessCommandDataInterface;
}
