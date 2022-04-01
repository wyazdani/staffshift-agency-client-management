import {LoggerContext} from 'a24-logzio-winston';
import {MongoError} from 'mongodb';
import {FilterQuery} from 'mongoose';
import {EventStoreProjectorInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {
  AgencyConsultantRoleAddedEventStoreDataInterface,
  AgencyConsultantRoleDisabledEventStoreDataInterface,
  AgencyConsultantRoleEnabledEventStoreDataInterface,
  AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface
} from 'EventTypes';
import {EventsEnum} from '../../Events';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {
  AgencyConsultantRolesProjectionV2DocumentType,
  AgencyConsultantRolesProjectionV2
} from '../../models/AgencyConsultantRolesProjectionV2';

const events = [
  EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

type SupportedEventsDataType =
  | AgencyConsultantRoleAddedEventStoreDataInterface
  | AgencyConsultantRoleDisabledEventStoreDataInterface
  | AgencyConsultantRoleEnabledEventStoreDataInterface
  | AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface;

/**
 * Projects to AgencyConsultantRoles
 */
export default class AgencyConsultantRolesProjector implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    if (!events.includes(event.type as EventsEnum)) {
      logger.debug('Incoming event ignored', {event: event.type});
      return;
    }
    logger.debug('Processing the incoming event', {event: event.type});
    const criteria: FilterQuery<AgencyConsultantRolesProjectionV2DocumentType> = {
      agency_id: event.aggregate_id.agency_id as string
    };

    const eventData = event.data as SupportedEventsDataType;

    if (eventData._id) {
      criteria._id = eventData._id;
    }

    switch (event.type) {
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED:
        await AgencyConsultantRolesProjector.addRecord(logger, event);
        break;
      case EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED:
        await AgencyConsultantRolesProjector.updateRecord(logger, criteria, {status: 'enabled'});
        break;
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED:
        await AgencyConsultantRolesProjector.updateRecord(logger, criteria, {status: 'disabled'});
        break;
      case EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED:
        await AgencyConsultantRolesProjector.updateRecord(
          logger,
          criteria,
          event.data as AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface
        );
        break;
      default:
        //This is never expected, because we already do an initial check to allow only these 4 events
        return Promise.reject(new Error(`Unsupported event ${event.type} in AgencyConsultantRolesProjector`));
    }
  }

  /**
   * Adds a new record to the projection collection
   */
  private static async addRecord(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventData = event.data as AgencyConsultantRoleAddedEventStoreDataInterface;
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
        logger.notice('Duplicate key error for agency consultant role record', record);
        return;
      }
      logger.error('Error saving a record to the consultant role projection', error);
      throw error;
    }
  }

  /**
   * Updates an existing record in the projection collection
   */
  private static async updateRecord(
    logger: LoggerContext,
    query: FilterQuery<AgencyConsultantRolesProjectionV2DocumentType>,
    updateObject: {status: string} | AgencyConsultantRoleDetailsUpdatedEventStoreDataInterface
  ): Promise<void> {
    try {
      await AgencyConsultantRolesProjectionV2.updateOne(query, {$set: updateObject}, {});
    } catch (error) {
      logger.error('Error updating a record to the consultant role projection', {
        query,
        updateObject,
        error
      });
      throw error;
    }
  }
}
