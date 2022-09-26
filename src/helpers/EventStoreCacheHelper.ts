import {LoggerContext} from 'a24-logzio-winston';
import LRU_TTL from 'lru-ttl-cache';
import {EventStore, EventStoreModelInterface} from '../models/EventStore';

/**
 * EventStoreCacheHelper
 *
 * Used for caching data
 */

export class EventStoreCacheHelper {
  cache: LRU_TTL<unknown, unknown>;
  /**
   * Constructor
   *
   */
  constructor() {
    this.cache = new LRU_TTL();
  }

  async findEventById(eventId: string, logger: LoggerContext, ttl: string): Promise<EventStoreModelInterface> {
    this.cache.ttl = ttl;
    this.cache.max = 10;
    if (this.cache.has(eventId)) {
      logger.debug('Fecthing cached results', {eventId});
      const organisationJobEvent = this.cache.get(eventId);

      return organisationJobEvent as EventStoreModelInterface;
    } else {
      const organisationJobEvent = await EventStore.findById(eventId);

      logger.debug('Event Store entry called from collection', {eventId});
      this.cache.set(eventId, organisationJobEvent);
      return organisationJobEvent;
    }
  }
}
