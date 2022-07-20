import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface OrganisationJobInitiatedApplyPaymentTermDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  term: string;
  client_id:string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OrganisationJobInitiatedApplyPaymentTermEventInterface
  extends EventStorePubSubModelInterface<
  OrganisationJobInitiatedApplyPaymentTermDataInterface,
    ConsultantJobAggregateIdInterface
  > {}
