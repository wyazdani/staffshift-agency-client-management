import {BookingPreferenceCommandEnum} from './BookingPreferenceCommandEnum';
import {BookingPreferenceCommandDataType} from './BookingPreferenceCommandDataType';
import {AggregateCommandInterface} from '../../types';
import {BookingPreferenceAggregateIdInterface} from '.';

export interface BookingPreferenceCommandInterface extends AggregateCommandInterface {
  aggregateId: BookingPreferenceAggregateIdInterface;
  type: BookingPreferenceCommandEnum;
  data: BookingPreferenceCommandDataType;
}
