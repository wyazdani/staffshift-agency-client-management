import {ConsultantJobProcessCommandEnum} from '../ConsultantJobProcessCommandEnum';
import {StartConsultantJobProcessCommandDataInterface} from '../CommandDataTypes';
import {ConsultantJobProcessCommandInterface} from '..';

export interface StartConsultantJobProcessCommandInterface extends ConsultantJobProcessCommandInterface {
  type: ConsultantJobProcessCommandEnum.START;
  data: StartConsultantJobProcessCommandDataInterface;
}
