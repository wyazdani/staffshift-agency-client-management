import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {map, get, has} from 'lodash';

export class EventStoreErrorEncoder {
  private static encodeError(error: Error): EventStoreEncodedErrorInterface {
    const code = get(error, 'code') || 'UNKNOWN_ERROR';
    const result: EventStoreEncodedErrorInterface = {
      code,
      message: error.message
    };

    if (get(error, 'originalError')) {
      result.originalError = EventStoreErrorEncoder.encodeError(get(error, 'originalError'));
    }
    if (code === 'MODEL_VALIDATION_FAILED') {
      result.errors = get(error, 'results.errors', []);
    }
    if (has(error, 'status')) {
      result.status = get(error, 'status');
    }
    return result;
  }

  /**
   * transforms error array object to be able to save it under EventStore
   */
  static encodeArray(errors: Error[]): EventStoreEncodedErrorInterface[] {
    return map(errors, (error) => EventStoreErrorEncoder.encodeError(error));
  }
}
