import {EventStorePipeline} from './EventStorePipeline';
import {Watcher, WatcherContext} from '../core/Watcher';

const pipelines = [new EventStorePipeline()];

const watcherContext: WatcherContext = Watcher.getWatcherContext('AgencyClientEventLogProjection', pipelines);

export default watcherContext;
