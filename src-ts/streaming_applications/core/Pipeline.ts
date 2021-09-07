import {LoggerContext} from "a24-logzio-winston";
import {ResumeTokenCollectionManager} from "./ResumeTokenCollectionManager";
import {MongoClients} from "./MongoClients";
import {PIPELINE_TYPES} from "./ChangeStreamEnums";

export interface WatchHandler {
  shutdown: Function
}
export class Pipeline {
  static getID(): string {
    throw new Error('get id not implemented');
  }
  getType(): PIPELINE_TYPES {
    throw new Error('Get type not implemented');
  }
  getMongoClientConfigKeys(): string[] {
    throw new Error('GetMongoClientConfigKeys not implemented');
  }
  watch(logger: LoggerContext, clientManager: MongoClients, tokenManager: ResumeTokenCollectionManager): Promise<WatchHandler> {
    throw new Error('watch method not implemented');
  }
}