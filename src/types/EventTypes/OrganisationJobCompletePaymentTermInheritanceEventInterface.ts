import {BaseEventStoreDataInterface} from 'EventTypes';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../aggregates/ConsultantJob/types';

export interface OrganisationJobCompletePaymentTermInheritanceDataInterface extends BaseEventStoreDataInterface {
  _id: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OrganisationJobCompletePaymentTermInheritanceEventInterface
  extends EventStorePubSubModelInterface<
    OrganisationJobCompletePaymentTermInheritanceDataInterface,
    ConsultantJobAggregateIdInterface
  > {}
