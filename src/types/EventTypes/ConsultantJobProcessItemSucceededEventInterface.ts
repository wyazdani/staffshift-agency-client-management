import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobProcessAggregateIdInterface} from '../../aggregates/ConsultantJobProcess/types';

export interface ConsultantJobProcessItemSucceededEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
  /* optional, It will be used in some bulk operations */
  consultant_role_id?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessItemSucceededEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobProcessItemSucceededEventStoreDataInterface,
    ConsultantJobProcessAggregateIdInterface
  > {}
