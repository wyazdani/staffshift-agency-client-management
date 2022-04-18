import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobProcessAggregateIdInterface} from '../../aggregates/ConsultantJobProcess/types';

export interface ConsultantJobProcessItemSucceededEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessItemSucceededEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobProcessItemSucceededEventStoreDataInterface,
    ConsultantJobProcessAggregateIdInterface
  > {}
