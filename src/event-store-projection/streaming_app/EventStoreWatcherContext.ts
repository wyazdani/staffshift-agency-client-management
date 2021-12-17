import {LoggerContext} from 'a24-logzio-winston';
import {MongoClients} from '../../streaming_applications/core/MongoClients';
import {AGENCY_CLIENT_MANAGEMENT_DB_KEY} from '../../streaming_applications/DatabaseConfigKeys';
import {EventStorePipeline} from './EventStorePipeline';
import {EventStoreProjectionResumeTokenCollectionManager} from './EventStoreProjectionResumeTokenCollectionManager';
import {PIPELINE_TYPES_ENUM} from '../../streaming_applications/core/ChangeStreamEnums';

export class EventStoreWatcherContext {
  private pipeline: EventStorePipeline;

  getMongoClientConfigKeys(): string[] {
    return [AGENCY_CLIENT_MANAGEMENT_DB_KEY];
  }

  async watch(
    type: PIPELINE_TYPES_ENUM,
    logger: LoggerContext,
    clientManager: MongoClients,
    tokenManager: EventStoreProjectionResumeTokenCollectionManager
  ): Promise<void> {
    this.pipeline = new EventStorePipeline(logger, clientManager, tokenManager);

    await this.pipeline.start();
  }
}