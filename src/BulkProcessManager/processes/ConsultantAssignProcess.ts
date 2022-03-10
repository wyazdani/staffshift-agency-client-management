import {LoggerContext} from 'a24-logzio-winston';
import {EventStorePubSubModelInterface} from 'ss-eventstore';
import {EventRepository} from '../../EventRepository';
import {AgencyClientConsultantsProjectionV3} from '../../models/AgencyClientConsultantsProjectionV3';
import {EventStore} from '../../models/EventStore';
import {ProcessInterface} from '../types/ProcessInterface';

/**
 * It handles bulk consultant assign to client
 */
export class ConsultantAssignProcess implements ProcessInterface {
  constructor(private logger: LoggerContext) {}

  execute(initiateEvent: EventStorePubSubModelInterface): Promise<void> {
    this.logger.info('Consultant Assign background process started', initiateEvent);
    const eventRepository = new EventRepository(EventStore, req.Logger.requestId);
    AgencyClientConsultantsProjectionV3.find({

    })
    return Promise.resolve();
  }
}
