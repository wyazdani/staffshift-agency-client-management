import {LoggerContext} from 'a24-logzio-winston';
import {IncomingMessage} from 'http';
import {EventRepository} from '../EventRepository';

export interface SwaggerRequestInterface extends IncomingMessage {
  Logger: typeof LoggerContext;
  swagger: {
    params: {[key: string]: unknown};
    operation: {
      'x-public-operation'?: boolean;
    };
  };
  eventRepository: EventRepository;
  basePathName: string;
}
