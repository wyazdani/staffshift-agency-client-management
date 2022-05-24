import {ConsultantJobUnassignInitiatedEventStoreDataInterface} from 'EventTypes';
import {LeanDocument} from 'mongoose';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {ConsultantJobAggregateIdInterface} from '../../../aggregates/ConsultantJob/types';
import {
  AgencyClientConsultantV3DocumentType,
  AgencyClientConsultantsProjectionV3
} from '../../../models/AgencyClientConsultantsProjectionV3';
export type AssignmentItemType = Pick<AgencyClientConsultantV3DocumentType, '_id' | 'client_id' | 'consultant_role_id'>;
export class ClientAssignments {
  static createInstance(
    event: EventStorePubSubModelInterface<
      ConsultantJobUnassignInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ): ClientAssignments {
    return new ClientAssignments(event);
  }
  constructor(
    private initiateEvent: EventStorePubSubModelInterface<
      ConsultantJobUnassignInitiatedEventStoreDataInterface,
      ConsultantJobAggregateIdInterface
    >
  ) {}

  /**
   * We query on projections to find the target
   * we already have an index on consultant_id which makes this query fast enough
   *
   */
  public async getClientAssignments(): Promise<LeanDocument<AssignmentItemType>[]> {
    return await AgencyClientConsultantsProjectionV3.find(this.getProjectionQuery(), {
      _id: 1,
      client_id: 1,
      consultant_id: 1,
      consultant_role_id: 1,
      agency_id: 1
    })
      .lean()
      .exec();
  }

  public async getEstimatedCount(): Promise<number> {
    return await AgencyClientConsultantsProjectionV3.count(this.getProjectionQuery()).exec();
  }

  private getProjectionQuery(): unknown {
    return {
      consultant_id: this.initiateEvent.data.consultant_id,
      agency_id: this.initiateEvent.aggregate_id.agency_id,
      ...(this.initiateEvent.data.client_ids && {
        client_id: {
          $in: this.initiateEvent.data.client_ids
        }
      }),
      ...(this.initiateEvent.data.consultant_role_id && {
        consultant_role_id: this.initiateEvent.data.consultant_role_id
      })
    };
  }
}
