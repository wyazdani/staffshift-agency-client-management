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
  constructor(private ttl: string) {
    this.cache = new LRU_TTL({
      max: 10, // Maximum Items Cache will hold
      ttl: this.ttl
    });
  }

  async findEventById(eventId: string, logger: LoggerContext): Promise<EventStoreModelInterface> {
    if (this.cache.has(eventId)) {
      logger.debug('Fecthing cached results', {eventId});
      const organisationJobEvent = this.cache.get(eventId);

      return organisationJobEvent as EventStoreModelInterface;
    } else {
      const organisationJobEvent = await EventStore.findById(eventId);

      logger.debug('Event Store entry called from collection', {eventId});
      if (organisationJobEvent) {
        this.cache.set(eventId, organisationJobEvent);
      }

      return organisationJobEvent;
    }
  }
}
