import {EventStorePipeline} from "./EventStorePipeline";
import {Watcher} from "../core/Watcher";

const pipelines = [new EventStorePipeline()];

module.exports = Watcher.getWatcherContext('AgencyClientsProjection', pipelines);