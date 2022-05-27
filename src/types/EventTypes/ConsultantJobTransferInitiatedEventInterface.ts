import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface ConsultantJobTransferInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  from_consultant_id: string;
  to_consultant_id: string;
  /* Optional, if not defined all we transfer all roles */
  consultant_role_id?: string;
  /* Optional, if not defined we transfer all clients for that consultant id */
  client_ids?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobTransferInitiatedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobTransferInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  > {}
