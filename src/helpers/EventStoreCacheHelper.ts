import {LoggerContext} from 'a24-logzio-winston';
import LRU_TTL from 'lru-ttl-cache';
import {EventStore, EventStoreModelInterface} from '../models/EventStore';

/**
 * EventStoreCacheHelper
 *
 * Used for caching data
 */

export class EventStoreCacheHelper {
  cache: LRU_TTL<string, EventStoreModelInterface>;
  constructor(private ttl: string, private max: number) {
    this.cache = new LRU_TTL({
      max: this.max, // Maximum Items Cache will hold
      ttl: this.ttl
    });
  }

  async findEventById(eventId: string, logger: LoggerContext): Promise<EventStoreModelInterface> {
    if (!this.cache.has(eventId)) {
      let organisationJobEvent = await EventStore.findById(eventId);

      logger.debug('Event Store entry called from collection', {eventId});
      /**
       * EventStoreCacheHelper
       *
       * We will ready from primary if result not found
       * Since we might be reading from secondary
       */
      if (!organisationJobEvent) {
        logger.debug('Event Store reading from primary', {eventId});
        organisationJobEvent = await EventStore.findById(eventId).read('primary');
      }
      this.cache.set(eventId, organisationJobEvent);
    }

    return this.cache.get(eventId) as EventStoreModelInterface;
  }
}
