import {SwaggerRequestInterface} from '../../src/types/SwaggerRequestInterface';
import {LoggerContext} from 'a24-logzio-winston';
import {EventRepository} from '../../src/EventRepository';
import {TestUtilsLogger} from './TestUtilsLogger';
import {EventStore} from '../../src/models/EventStore';
import sinon from 'sinon';
import {createRequest, createResponse} from 'node-mocks-http';
import {ServerResponse} from 'http';

/**
 * creates fake Http Request object to use in controller unit test cases
 *
 * @param opts
 */
export const fakeRequest = (opts: {
  logger?: typeof LoggerContext;
  swaggerParams: {[key in string]: unknown};
  eventRepository?: EventRepository;
  basePathName?: string;
}): SwaggerRequestInterface =>
  createRequest<SwaggerRequestInterface>({
    Logger: opts.logger || TestUtilsLogger.getLogger(sinon.spy()),
    swagger: {
      params: opts.swaggerParams,
      operation: {}
    },
    eventRepository: opts.eventRepository || new EventRepository(EventStore, 'some-id'),
    basePathName: opts.basePathName || 'sample'
  });

/**
 * creates fake response object to use in controller unit test cases
 */
export const fakeResponse = (): ServerResponse => createResponse<ServerResponse>();
