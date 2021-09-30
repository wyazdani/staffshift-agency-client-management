import {AgencyConsultantProjectionPipeline} from './AgencyConsultantProjectionPipeline';
import {Watcher, WatcherContext} from '../core/Watcher';

const pipelines = [new AgencyConsultantProjectionPipeline()];
const watcherContext: WatcherContext = Watcher.getWatcherContext('AgencyClientEventLogProjection', pipelines);

export default watcherContext;
