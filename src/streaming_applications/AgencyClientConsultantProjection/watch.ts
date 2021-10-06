import {AgencyClientConsultantProjectionCorePipeline} from './pipelines/AgencyClientConsultantProjectionCorePipeline';
import {Watcher, WatcherContext} from '../core/Watcher';

const pipelines = [new AgencyClientConsultantProjectionCorePipeline()];
const watcherContext: WatcherContext = Watcher.getWatcherContext('AgencyClientConsultant', pipelines);

export default watcherContext;
