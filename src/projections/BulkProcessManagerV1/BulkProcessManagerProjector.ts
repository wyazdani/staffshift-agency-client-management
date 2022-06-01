import {LoggerContext} from 'a24-logzio-winston';
import {EventStoreProjectorInterface, EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventsEnum} from '../../Events';
import {EventHandlerFactory} from './EventHandlerFactory';

const events = [
  EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
  EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
  EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED,
  EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED,
  EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED,
  EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED
];

export default class BulkProcessManagerProjector implements EventStoreProjectorInterface {
  async project(logger: LoggerContext, event: EventStorePubSubModelInterface): Promise<void> {
    const eventType: EventsEnum = event.type as EventsEnum;

    if (!events.includes(eventType)) {
      logger.debug('Incoming event ignored', {eventType, event});
      return;
    }
    const eventHandler = EventHandlerFactory.getHandler(eventType, logger);

    try {
      await eventHandler.handle(event);
    } catch (error) {
      logger.error('Error in Bulk Process Manager Projector', {
        error,
        _id: event._id
      });
      throw error;
    }
  }
}
