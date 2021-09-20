import _ from 'lodash';
import {JWTSecurityHelper} from './helpers/JWTSecurityHelper';
import {SwaggerRequest} from "SwaggerRequest";
import {ServerResponse} from "http";
import path from 'path';
import { EventRepository } from './EventRepository';
import { EventStore } from './models/EventStore';
const app = require('connect')();
const http = require('http');
const swaggerTools = require('swagger-tools');
const jsyaml = require('js-yaml');
const fs = require('fs');
const config = require('config');
const A24ErrorUtils = require('a24-node-error-utils');
const {RuntimeError, ErrorHandler} = require('a24-node-error-utils');
const Logger = require('a24-logzio-winston');
const Url = require('url');
Logger.setup(config.logger);
const serverPort = (config.has('server.port')) ? config.get('server.port') : 3370;
const mongoose = require('mongoose');
mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });
mongoose.Promise = global.Promise;
const {MessagePublisher} = require('a24-node-pubsub');
const {Auditor} = require('a24-node-octophant-utils');
const {createHttpTerminator} = require('http-terminator');
const pubsubAuditConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get('octophant_audit.pubsub_project'),
  topics: config.get('octophant_audit.pubsub_topics')
};
const {LinkHeaderHelper} = require('a24-node-query-utils');

MessagePublisher.configure(pubsubAuditConfig);
// Allow any calls on /docs and /api-docs
const allowedRegex = '^/docs.*|^/api-docs.*';
// swaggerRouter configuration
const options = {
  swaggerUi: '/swagger.json',
  controllers: path.resolve(__dirname, 'controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// Configure the LinkHeaderHelper for required link header for pagination
LinkHeaderHelper.configure(config.get('exposed_server'));

const errorHandlerConfig = {
  client_errors: config.get('client_errors')
};
A24ErrorUtils.configure(errorHandlerConfig);

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error: Error) {
    const loggerContext = Logger.getContext('startup');
    loggerContext.crit('MongoDB connection error', error);
    process.exit(1);
  }
);

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
// eslint-disable-next-line no-sync
const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function middleWareFunc(middleware: any) {

  app.use(function initUse(req: SwaggerRequest, res: ServerResponse, next: Function) {
    let loggerContext = null;
    if (!_.isEmpty(req.headers) && !_.isEmpty(req.headers['x-request-id'])) {
      loggerContext = Logger.getContext(req.headers['x-request-id']);
    } else {
      loggerContext = Logger.getContext();
    }
    // Strip off the query params to keep log message to minimum and to use that in a building link header
    const parsedUrl = Url.parse(req.url);
    req.basePathName = parsedUrl.pathname;
    const logMessage = `${req.method} request started for: ${req.basePathName}`;

    loggerContext.info(logMessage, {
      method: req.method,
      url: req.url
    });
    req.Logger = loggerContext;
    next();
  });

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Validate Swagger requests
  app.use(middleware.swaggerValidator());

  const securityMetaData: {[key in string]: any} = {};
  app.use(function configureAuditorContext(req: SwaggerRequest, res: ServerResponse, next: Function) {
    // Allow the docs to load
    if (req.url.match(allowedRegex) || (!_.isEmpty(req.swagger.operation) && req.swagger.operation['x-public-operation'] === true)) {
      return next();
    }
    const jwtToken = req.headers['x-request-jwt'];
    if (!jwtToken) {
      return next(
        new RuntimeError('Missing required JWT header, update swagger api definition to make X-Request-JWT required')
      );
    }
    if (_.isEmpty(req.swagger.operation)) { // operation not supported, lets return.swagger will handle with 405.
      return next();
    }
    // Make sure octophant-event is configured correctly
    if (!req.swagger.operation['x-octophant-event'] && _.isEmpty(req.swagger.operation['x-octophant-event'])) {
      return next(new RuntimeError('x-octophant-event is expected to be configured for operation, but is not'));
    }
    const publisher = new MessagePublisher(req.Logger);
    req.octophant = Auditor.getAuditorContext(
      req,
      jwtToken,
      req.Logger,
      publisher,
      config.get('octophant_audit'),
      req.swagger.operation['x-octophant-event']
    );
    next();
  });

  // Modifying the middleware swagger security, to cater for jwt verification
  securityMetaData.jwt = function validateJWT(req: any, def: any, token: any, next: Function) {
    return JWTSecurityHelper.jwtVerification(token, config.api_token, (err, response) => {
      if (err) {
        return next(err);
      }
      // TODO not sure if this is expected, requires investigation - https://github.com/A24Group/staffshift-agency-client-management/issues/40
      if (req.Logger.requestId !== response.decoded.request_id) {
        req.Logger.info(
          'JWT and current logger do not have matching request identifiers',
          {loggerContext: req.Logger.requestId, jwt: response.decoded.request_id}
        );
      }
      const eventRepository = new EventRepository(
        EventStore,
        req.Logger.requestId,
        {
          user_id: response.decoded.sub,
          client_id: response.decoded.client_id,
          context: response.decoded.context
      });
      _.set(req, 'eventRepository', eventRepository);
      next();
    });
  };
  // Set the methods that should be used for swagger security
  app.use(middleware.swaggerSecurity(securityMetaData));
  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  app.use(function errorHandler(err: any, req: any, res: any, next: Function) {
    ErrorHandler.onError(err, req, res, next);
  });

  // Start the server
  const server = http.createServer(app);
  server.setTimeout(config.get('server.timeout'));
  server.listen(serverPort, function createFunc() {
    // eslint-disable-next-line no-console
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    // eslint-disable-next-line no-console
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

  const httpTerminator = createHttpTerminator({
    server,
    gracefulTerminationTimeout: config.get('graceful_shutdown.http.server_close_timeout')
  });
  const logger = Logger.getContext();
  async function shutdown() {
    logger.log('info', 'starting graceful shutdown process');
    //This delay is to make sure k8s iptables are updated and no new request is established.
    //more info: https://blog.laputa.io/graceful-shutdown-in-kubernetes-85f1c8d586da
    await new Promise((resolve) => setTimeout(resolve, config.get('graceful_shutdown.http.delay')));
    logger.log('info', 'delay finished, closing the server');
    try {
      await httpTerminator.terminate();
      logger.log('info', 'server stopped gracefully');
      await Logger.close();
      const used: any = process.memoryUsage();
      let memoryLog = 'Memory Usage: ';
      for (const key in used) {
        memoryLog += ` ${key}: ${Math.round(+used[key] / 1024 / 1024 * 100) / 100}MB`;
      }
      console.log(memoryLog);
      process.exit(0);
    } catch (err) {
      logger.log('error', 'could not do graceful shutdown in the specified time, exiting forcefully', err);
      await Logger.close();
      process.exit(1);
    }
  }
  for (const signal of config.get('graceful_shutdown.signals')) {
    process.on(signal, shutdown);
  }
});