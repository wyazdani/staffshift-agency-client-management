import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {map, get} from 'lodash';

export class EventStoreErrorEncoder {
  /**
   * transforms error array object to be able to save it under EventStore
   */
  static encodeArray(errors: Error[]): EventStoreEncodedErrorInterface[] {
    return map(errors, (error) => ({
      code: get(error, 'code') || 'UNKNOWN_ERROR',
      message: error.message
    }));
  }
}
