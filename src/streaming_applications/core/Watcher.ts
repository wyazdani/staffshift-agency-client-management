import {concat} from 'lodash';
import {PipelineInterface, WatchHandlerInterface} from './Pipeline';
import {LoggerContext} from 'a24-logzio-winston';
import {MongoClients} from './MongoClients';
import {ResumeTokenCollectionManager} from './ResumeTokenCollectionManager';
import {PIPELINE_TYPES_ENUM} from './ChangeStreamEnums';

export class WatcherContext {
  private watchHandlers: WatchHandlerInterface[];
  constructor(private name: string, private pipelines: PipelineInterface[]) {
    this.watchHandlers = [];
  }

  getStreamingAppName(): string {
    return this.name;
  }

  getPipelines(): PipelineInterface[] {
    return this.pipelines;
  }

  getMongoClientConfigKeys(type: PIPELINE_TYPES_ENUM): string[] {
    let keys: string[] = [];

    for (const item of this.getPipelines()) {
      if (item.getType() === type) {
        keys = concat(keys, item.getMongoClientConfigKeys());
      }
    }

    return keys;
  }

  async watch(
    type: PIPELINE_TYPES_ENUM,
    logger: typeof LoggerContext,
    clientManager: MongoClients,
    tokenManager: ResumeTokenCollectionManager
  ): Promise<void> {
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

  async shutdown(): Promise<void> {
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
