import {LoggerContext} from 'a24-logzio-winston';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {FacadeClientHelper} from '../../../helpers/FacadeClientHelper';
import {
  AgencyClientConsultantAssignedEventStoreDataInterface,
  AgencyConsultantRoleAddedEventStoreDataInterface
} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {MongoError} from 'mongodb';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {AgencyConsultantRolesProjectionV2} from 'src/models/AgencyConsultantRolesProjectionV2';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientConsultantRoleAddedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<EventStorePubSubModelInterface>> {
  constructor(private logger: LoggerContext) {}

  /**
   * Adds a new record to the projection collection
   */
  async handle(event: EventStoreModelInterface<EventStorePubSubModelInterface>): Promise<void> {
    const eventData = event.data as unknown as AgencyConsultantRoleAddedEventStoreDataInterface;
    const record = {
      agency_id: event.aggregate_id.agency_id,
      name: eventData.name,
      description: eventData.description,
      max_consultants: eventData.max_consultants,
      _id: eventData._id
    };

    try {
      await AgencyConsultantRolesProjectionV2.create(record);
    } catch (error) {
      if ((error as MongoError).code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        this.logger.notice('Duplicate key error for agency consultant role record', record);
        return;
      }
      this.logger.error('Error saving a record to the consultant role projection', error);
      throw error;
    }
  }
}
