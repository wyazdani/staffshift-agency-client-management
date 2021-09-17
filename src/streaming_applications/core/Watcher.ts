import _ from 'lodash';
import {Pipeline, WatchHandler} from './Pipeline';
import {LoggerContext} from 'a24-logzio-winston';
import {MongoClients} from './MongoClients';
import {ResumeTokenCollectionManager} from './ResumeTokenCollectionManager';
import {PIPELINE_TYPES} from './ChangeStreamEnums';

export class WatcherContext {
  private watchHandlers: WatchHandler[];
  constructor(private name: string, private pipelines: Pipeline[]) {
    this.watchHandlers = [];
  }
  getStreamingAppName(): string {
    return this.name;
  }
  getPipelines(): Pipeline[] {
    return this.pipelines;
  }
  getMongoClientConfigKeys(type: PIPELINE_TYPES) {
    let keys: string[] = [];
    for (const item of this.getPipelines()) {
      if (item.getType() === type) {
        keys = concat(keys, item.getMongoClientConfigKeys());
      }
    }
    return keys;
  }
  async watch(type: PIPELINE_TYPES, logger: LoggerContext, clientManager: MongoClients, tokenManager: ResumeTokenCollectionManager) {
    this.watchHandlers = [];
    for (const PipelineClass of this.getPipelines()) {
      if (PipelineClass.getType() === type) {
        try {
          this.watchHandlers.push(await PipelineClass.watch(logger, clientManager, tokenManager));
        } catch (error) {
          logger.error('There was an error while trying to initialise all the watchers', error);
          process.exit(1);
        }
      }
    }
  }
  async shutdown() {
    const promiseArray = [];
    for (const pipeline of this.watchHandlers) {
      promiseArray.push(pipeline.shutdown());
    }
    await Promise.allSettled(promiseArray);
  }
}

export class Watcher {
  static getWatcherContext(name: string, pipelines: any[]): WatcherContext {
    return new WatcherContext(name, pipelines);
  }
}