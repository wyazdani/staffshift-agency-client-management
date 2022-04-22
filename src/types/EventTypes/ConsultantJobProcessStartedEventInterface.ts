import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobProcessAggregateIdInterface} from '../../aggregates/ConsultantJobProcess/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessStartedEventStoreDataInterface extends BaseEventStoreDataInterface {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessStartedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobProcessStartedEventStoreDataInterface,
    ConsultantJobProcessAggregateIdInterface
  > {}
