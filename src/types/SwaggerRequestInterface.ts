import {LoggerContext} from 'a24-logzio-winston';
import {IncomingMessage} from 'http';
import {GenericObjectInterface} from 'GenericObjectInterface';

export interface SwaggerRequestInterface extends IncomingMessage {
  Logger: typeof LoggerContext,
  swagger: {
    params: {[key: string]: unknown},
    operation: {
      'x-octophant-event'?: string,
      'x-public-operation'?: boolean
    }
  },
  octophant: GenericObjectInterface,
  basePathName: string
}