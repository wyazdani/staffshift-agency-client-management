'use strict';

const EventStorePipeline = require('./EventStorePipeline');
const pipelines = [EventStorePipeline];

const Watcher = require('../core/Watcher');
module.exports = Watcher.getWatcherContext('AgencyClientsProjection', pipelines);