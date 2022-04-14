import {LoggerContext} from 'a24-logzio-winston';
import {IncomingMessage} from 'http';
import {CommandBus} from '../aggregates/CommandBus';

export interface SwaggerRequestInterface extends IncomingMessage {
  Logger: LoggerContext;
  swagger: {
    params: {[key: string]: unknown};
    operation: {
      'x-public-operation'?: boolean;
    };
  };
  commandBus: CommandBus;
  basePathName: string;
}
