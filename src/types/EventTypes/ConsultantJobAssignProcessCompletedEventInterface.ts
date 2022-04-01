import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAssignAggregateIdInterface} from '../../aggregates/ConsultantJobAssign/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobAssignProcessCompletedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobAssignProcessCompletedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobAssignProcessCompletedEventStoreDataInterface,
    ConsultantJobAssignAggregateIdInterface
  > {}
