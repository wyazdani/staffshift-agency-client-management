import {LoggerContext} from 'a24-logzio-winston';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {EventRepository} from '../../../EventRepository';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {
  AgencyClientsProjectionV2,
  AgencyClientsProjectionV2DocumentType
} from '../../../models/AgencyClientsProjectionV2';
import {AgencyClientLinkedEventStoreDataInterface} from 'EventTypes';
import {FilterQuery} from 'mongoose';


export class AgencyClientLinkedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientLinkedEventStoreDataInterface>> {
  constructor(private logger: LoggerContext, private eventRepository: EventRepository) {}


  async handle(event: EventStoreModelInterface<AgencyClientLinkedEventStoreDataInterface>): Promise<void> {

  }
}
