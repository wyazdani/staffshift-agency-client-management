import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface OrganisationJobInitiateInheritedPaymentTermDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  client_id:string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OrganisationJobInitiateInheritedPaymentTermEventInterface
  extends EventStorePubSubModelInterface<
    OrganisationJobInitiateInheritedPaymentTermDataInterface,
    ConsultantJobAggregateIdInterface
  > {}
