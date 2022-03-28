import {EventRepository, EventInterface} from '../EventRepository';
import {EventStoreModelInterface} from '../models/EventStore';

export abstract class AbstractRepository {
  protected constructor(protected eventRepository: EventRepository) {}

  /**
   * Persist agency related events into event store
   */
  async save(events: EventInterface[]): Promise<EventStoreModelInterface[]> {
    return this.eventRepository.save(events);
  }
}
