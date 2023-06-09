import {SwaggerRequestInterface} from '../../src/types/SwaggerRequestInterface';
import {LoggerContext} from 'a24-logzio-winston';
import {EventRepository} from '../../src/EventRepository';
import {TestUtilsLogger} from './TestUtilsLogger';
import {EventStore} from '../../src/models/EventStore';
import sinon from 'sinon';
import {createRequest, createResponse} from 'node-mocks-http';
import {ServerResponse} from 'http';
import {CommandBus} from '../../src/aggregates/CommandBus';

/**
 * creates fake Http Request object to use in controller unit test cases
 *
 * @param opts
 */
export const fakeRequest = (opts: {
  Logger?: LoggerContext;
  swaggerParams: {[key in string]: unknown};
  eventRepository?: EventRepository;
  basePathName?: string;
  commandBus: CommandBus;
}): SwaggerRequestInterface =>
  createRequest<SwaggerRequestInterface>({
    Logger: opts.Logger || TestUtilsLogger.getLogger(sinon.spy()),
    swagger: {
      params: opts.swaggerParams,
      operation: {}
    },
    eventRepository: opts.eventRepository || new EventRepository(EventStore, 'some-id'),
    basePathName: opts.basePathName || 'sample',
    commandBus: opts.commandBus
  });

/**
 * creates fake response object to use in controller unit test cases
 */
export const fakeResponse = (): ServerResponse => createResponse<ServerResponse>();
