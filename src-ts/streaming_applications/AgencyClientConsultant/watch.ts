import {EventStorePipeline} from "./EventStorePipeline";
import {Watcher} from "../core/Watcher";

const pipelines = [EventStorePipeline];

module.exports = Watcher.getWatcherContext('AgencyClientConsultant', pipelines);