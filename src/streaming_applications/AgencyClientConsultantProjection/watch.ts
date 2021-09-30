import {EventStorePipeline} from './pipelines/EventStorePipeline';
import {Watcher, WatcherContext} from '../core/Watcher';

const pipelines = [new EventStorePipeline()];
const watcherContext: WatcherContext = Watcher.getWatcherContext('AgencyClientConsultant', pipelines);

export default watcherContext;
