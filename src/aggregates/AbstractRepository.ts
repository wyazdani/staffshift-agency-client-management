import {EventRepository, EventInterface} from '../EventRepository';

export abstract class AbstractRepository {
  protected constructor(protected eventRepository: EventRepository) {}

  /**
   * Persist agency related events into event store
   */
  async save(events: EventInterface[]): Promise<void> {
    return this.eventRepository.save(events);
  }
}
