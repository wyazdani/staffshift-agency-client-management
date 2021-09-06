'use strict';
const _ = require('lodash');

class Watcher {
  static getWatcherContext(name, pipelines) {
    return {
      _pipelines: [],
      getStreamingAppName() {
        return name;
      },
      getPipelines() {
        return pipelines;
      },
      getMongoClientConfigKeys(type) {
        let keys = [];
        for (const item of this.getPipelines()) {
          if (item.getType() === type) {
            keys = _.concat(keys, item.getMongoClientConfigKeys());
          }
        }
        return keys;
      },
      async watch(type, logger, clientManager, tokenManager) {
        const pipelines = [];
        for (const PipelineClass of this.getPipelines()) {
          if (PipelineClass.getType() === type) {
            try {
              pipelines.push(await PipelineClass.watch(logger, clientManager, tokenManager));
            } catch (error) {
              logger.error('There was an error while trying to initialise all the watchers', error);
              process.exit(1);
            }
          }
        }
        this._pipelines = pipelines;
      },
      async shutdown() {
        const promiseArray = [];
        for (const pipeline of this._pipelines) {
          promiseArray.push(pipeline.shutdown());
        }
        await Promise.allSettled(promiseArray);
      }
    };
  }
}

module.exports = Watcher;