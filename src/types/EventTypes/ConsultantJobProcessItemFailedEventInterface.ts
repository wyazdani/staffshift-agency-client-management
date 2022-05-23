import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobProcessAggregateIdInterface} from '../../aggregates/ConsultantJobProcess/types';
import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface ConsultantJobProcessItemFailedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
  /* optional, It will be used in some bulk operations */
  consultant_role_id?: string;
  errors: EventStoreEncodedErrorInterface[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobProcessItemFailedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobProcessItemFailedEventStoreDataInterface,
    ConsultantJobProcessAggregateIdInterface
  > {}
