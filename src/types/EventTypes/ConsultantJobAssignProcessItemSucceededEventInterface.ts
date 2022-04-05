import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAssignAggregateIdInterface} from '../../aggregates/ConsultantJobAssign/types';

export interface ConsultantJobAssignProcessItemSucceededEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobAssignProcessItemSucceededEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobAssignProcessItemSucceededEventStoreDataInterface,
    ConsultantJobAssignAggregateIdInterface
  > {}