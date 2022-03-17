import {LoggerContext} from 'a24-logzio-winston';
import config from 'config';
import {EventsEnum} from '../Events';
import {ProcessInterface} from './types/ProcessInterface';
import {ConsultantAssignProcess} from './processes/ConsultantAssignProcess/ConsultantAssignProcess';

export class ProcessFactory {
  static getProcess(logger: LoggerContext, eventType: string): ProcessInterface {
    switch (eventType) {
      case EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED:
        return new ConsultantAssignProcess(logger, {
          maxRetry: config.get<number>('bulk_process_manager.processes.consultant_assign.max_retry'),
          retryDelay: config.get<number>('bulk_process_manager.processes.consultant_assign.retry_delay')
        });
      default:
        throw new Error(`no process found for ${eventType}`);
    }
  }
}
