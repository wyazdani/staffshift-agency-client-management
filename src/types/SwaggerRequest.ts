import {LoggerContext} from 'a24-logzio-winston';
import {IncomingMessage} from 'http';

export interface SwaggerRequest extends IncomingMessage{
  Logger: LoggerContext,
  swagger: {
    params: {[key: string]: any},
    operation: {
      'x-octophant-event'?: string,
      'x-public-operation'?: boolean
    }
  },
  octophant: object,
  basePathName: string
}