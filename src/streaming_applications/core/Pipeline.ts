import {LoggerContext} from 'a24-logzio-winston';
import {ResumeTokenCollectionManager} from './ResumeTokenCollectionManager';
import {MongoClients} from './MongoClients';
import {PIPELINE_TYPES_ENUM} from './ChangeStreamEnums';

export interface WatchHandlerInterface {
  shutdown: () => void
}

export interface PipelineInterface {
  getID(): string
  getType(): PIPELINE_TYPES_ENUM
  getMongoClientConfigKeys(): string[]
  watch(
    logger: typeof LoggerContext,
    clientManager: MongoClients,
    tokenManager: ResumeTokenCollectionManager): Promise<WatchHandlerInterface>
}