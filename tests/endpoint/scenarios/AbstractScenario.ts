import {EventRepository} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';

/**
 * All scenarios should extend this class
 */
export abstract class AbstractScenario {
  protected eventRepository;

  constructor() {
    this.eventRepository = new EventRepository(EventStore, '12345', {user_id: '6141d9cb9fb4b44d53469145'});
  }

  /**
   * Delete all events from event store collection
   */
  async deleteAllEvents() {
    await EventStore.deleteMany({}).exec();
  }
}
