import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface ConsultantJobUnassignInitiatedEventStoreDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  consultant_id: string;
  /* Optional, if not defined all we unassign all roles */
  consultant_role_id?: string;
  /* Optional, if not defined we unassign all clients for that consultant id */
  client_ids?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobUnassignInitiatedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobUnassignInitiatedEventStoreDataInterface,
    ConsultantJobAggregateIdInterface
  > {}
