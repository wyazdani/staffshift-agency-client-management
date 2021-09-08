import {LoggerContext} from "a24-logzio-winston";
import {ResumeTokenCollectionManager} from "./ResumeTokenCollectionManager";
import {MongoClients} from "./MongoClients";
import {PIPELINE_TYPES} from "./ChangeStreamEnums";

export interface WatchHandler {
  shutdown: Function
}
export interface Pipeline {
  getID(): string
  getType(): PIPELINE_TYPES
  getMongoClientConfigKeys(): string[]
  watch(logger: LoggerContext, clientManager: MongoClients, tokenManager: ResumeTokenCollectionManager): Promise<WatchHandler>
}