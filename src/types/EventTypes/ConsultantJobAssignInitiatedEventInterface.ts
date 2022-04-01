import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface ConsultantJobAssignInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_id: string;
  consultant_role_id: string;
  client_ids: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobAssignInitiatedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobAssignInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  > {}