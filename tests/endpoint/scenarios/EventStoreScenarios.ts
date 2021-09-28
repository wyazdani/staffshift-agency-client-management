import {EventStore} from '../../../src/models/EventStore';

export class EventStoreScenarios {
  static async removeAll() {
    await EventStore.remove({});
  }
}