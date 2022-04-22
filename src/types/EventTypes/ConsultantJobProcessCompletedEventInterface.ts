import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobProcessAggregateIdInterface} from '../../aggregates/ConsultantJobProcess/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessCompletedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessCompletedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobProcessCompletedEventStoreDataInterface,
    ConsultantJobProcessAggregateIdInterface
  > {}
