import {BaseEventStoreDataInterface} from 'EventTypes';
import NodeCache from 'node-cache';
import {EventStore, EventStoreModelInterface} from '../models/EventStore';

/**
 * CacheHelper
 *
 * Used for caching data
 */

export class EventStoreCacheHelper {
  cacheInit: NodeCache;
  /**
   * Constructor
   *
   */
  constructor() {
    this.cacheInit = new NodeCache();
  }

  async findEventById(eventId: string, ttl: number): Promise<EventStoreModelInterface<BaseEventStoreDataInterface>> {
    if (this.cacheInit.has(eventId)) {
      return this.cacheInit.get(eventId);
    } else {
      const organisationJobEvent = await EventStore.findById(eventId);

      this.cacheInit.set(eventId, organisationJobEvent, ttl);
      return organisationJobEvent;
    }
  }
}
