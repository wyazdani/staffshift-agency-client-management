import {EventStorePipeline} from './EventStorePipeline';
import {Watcher, WatcherContext} from '../core/Watcher';

const pipelines = [new EventStorePipeline()];

const watcherContext: WatcherContext = Watcher.getWatcherContext('AgencyClientsProjection', pipelines);

export default watcherContext;
