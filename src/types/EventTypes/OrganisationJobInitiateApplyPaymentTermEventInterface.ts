import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface OrganisationJobInitiateApplyPaymentTermDataInterface extends BaseEventStoreDataInterface {
  _id: string;
  term: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OrganisationJobInitiateApplyPaymentTermEventInterface
  extends EventStorePubSubModelInterface<
  OrganisationJobInitiateApplyPaymentTermDataInterface,
    ConsultantJobAggregateIdInterface
  > {}
