import {LoggerContext} from 'a24-logzio-winston';
import {EventsEnum} from '../Events';
import {ProcessInterface} from './types/ProcessInterface';
import {ConsultantAssignProcess} from './processes/ConsultantAssignProcess/ConsultantAssignProcess';

export class ProcessFactory {
  static getProcess(logger: LoggerContext, eventType: string): ProcessInterface {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
        return new ConsultantAssignProcess(logger, {
          maxRetry: 5,
          retryDelay: 10000
        });
      default:
        throw new Error(`no process found for ${eventType}`);
    }
  }
}
