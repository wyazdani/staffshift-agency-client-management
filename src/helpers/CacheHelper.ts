import {LoggerContext} from 'a24-logzio-winston';
import {BaseEventStoreDataInterface} from 'EventTypes';
import NodeCache from 'node-cache';
import {EventStore, EventStoreModelInterface} from '../models/EventStore';
const cacheInit = new NodeCache();

/**
 * CacheHelper
 *
 * Used for caching data
 */
export class CacheHelper {
  async cacheRetrieveEvent(
    key: string,
    id: string,
    ttl: number
  ): Promise<EventStoreModelInterface<BaseEventStoreDataInterface>> {
    if (cacheInit.has(key)) {
      return cacheInit.get(key);
    } else {
      const organisationJobEvent = await EventStore.findById(id);

      cacheInit.set(key, organisationJobEvent, ttl);
      return organisationJobEvent;
    }
  }
}
