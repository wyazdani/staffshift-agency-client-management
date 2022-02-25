import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {AgencyRepository} from '../../../src/aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../src/aggregates/Agency/AgencyWriteProjectionHandler';

/**
 * All scenarios should extend this class
 */
export abstract class AbstractScenario {
  protected eventRepository;
  protected agencyRepository;

  constructor() {
    this.eventRepository = new EventRepository(EventStore, '12345', {user_id: '6141d9cb9fb4b44d53469145'});
    this.agencyRepository = new AgencyRepository(this.eventRepository, new AgencyWriteProjectionHandler());
  }

  /**
   * Delete all events from event store collection
   */
  async deleteAllEvents() {
    await EventStore.deleteMany({}).exec();
  }
}
