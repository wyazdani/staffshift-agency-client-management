import {LoggerContext, LogLevel} from "a24-logzio-winston";
import {SinonSpy} from 'sinon';

class Logger implements LoggerContext {
  constructor(private logSpy: SinonSpy) {
  }
  readonly logLevels: { INFO: "info"; CRITICAL: "crit"; ERROR: "error"; WARN: "warning"; NOTICE: "notice"; DEBUG: "debug"; EMERGENCY: "emerg"; ALERT: "alert" };
  readonly requestId: string;

  alert(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  crit(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  debug(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  emerg(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  error(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  info(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  log(level: LogLevel, message: string, object?: any): void {
    this.logSpy(message, object);
  }

  logAction(level: LogLevel, message: string, object?: any): void {
    this.logSpy(message, object);
  }

  notice(message: string, object?: any): void {
    this.logSpy(message, object);
  }

  warning(message: string, object?: any): void {
    this.logSpy(message, object);
  }

}

export class TestUtilsLogger {
  static getLogger(logSpy: SinonSpy): LoggerContext {
    return new Logger(logSpy);
  }
}