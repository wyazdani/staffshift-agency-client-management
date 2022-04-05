import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAssignAggregateIdInterface} from '../../aggregates/ConsultantJobAssign/types';
import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';

export interface ConsultantJobAssignProcessItemFailedEventStoreDataInterface extends BaseEventStoreDataInterface {
  client_id: string;
  errors: EventStoreEncodedErrorInterface[];
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ConsultantJobAssignProcessItemFailedEventInterface
  extends EventStorePubSubModelInterface<
    ConsultantJobAssignProcessItemFailedEventStoreDataInterface,
    ConsultantJobAssignAggregateIdInterface
  > {}