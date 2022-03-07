import {LoggerContext} from 'a24-logzio-winston';
import {EventsEnum} from '../Events';
import {ProcessInterface} from './ProcessInterface';
import {ConsultantAssignProcess} from './processes/ConsultantAssignProcess';

export class ProcessFactory {
  static getProcess(logger: LoggerContext, eventType: EventsEnum): ProcessInterface {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
        return new ConsultantAssignProcess(logger);
      default:
        throw new Error(`no process found for ${eventType}`);
    }
  }
}
