import {isEmpty} from 'lodash';
import {JWTSecurityHelper} from './helpers/JWTSecurityHelper';
import {SwaggerRequestInterface} from 'SwaggerRequestInterface';
import http, {ServerResponse} from 'http';
import connect from 'connect';
const app = connect();
import swaggerTools from 'swagger-tools';
import {load} from 'js-yaml';
import fs from 'fs';
import config from 'config';
import A24ErrorUtils, {RuntimeError, ErrorHandler} from 'a24-node-error-utils';
import Logger from 'a24-logzio-winston';
import Url from 'url';
Logger.setup(config.get('logger'));
const serverPort = (config.has('server.port')) ? config.get('server.port') : 3370;
import mongoose, {ConnectOptions, Error} from 'mongoose';
mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });
import {mongooseTimezone, timezoneMiddleware} from 'a24-node-timezone-utils';
mongoose.plugin(mongooseTimezone);
mongoose.Promise = global.Promise;
import {MessagePublisher} from 'a24-node-pubsub';
import {Auditor} from 'a24-node-octophant-utils';
import {createHttpTerminator} from 'http-terminator';
const pubsubAuditConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get('octophant_audit.pubsub_project'),
  topics: config.get('octophant_audit.pubsub_topics')
};
import {LinkHeaderHelper} from 'a24-node-query-utils';
import {GenericObjectInterface} from 'GenericObjectInterface';

MessagePublisher.configure(pubsubAuditConfig);
// Allow any calls on /docs and /api-docs
const allowedRegex = '^/docs.*|^/api-docs.*';
// swaggerRouter configuration
const options = {
  swaggerUi: '/swagger.json',
  controllers: './dist/controllers',
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// Configure the LinkHeaderHelper for required link header for pagination
LinkHeaderHelper.configure(config.get('exposed_server'));

const errorHandlerConfig = {
  client_errors: config.get('client_errors')
};
A24ErrorUtils.configure(errorHandlerConfig);

const mongooseErrorCallback = (error: Error) => {
  const loggerContext = Logger.getContext('startup');
  loggerContext.error('MongoDB connection error', error);
  return process.exit(1);
};

mongoose
  .connect(config.get<GenericObjectInterface>('mongo').database_host,
    config.get<GenericObjectInterface>('mongo').options as ConnectOptions)
  .catch(mongooseErrorCallback);

mongoose.connection.on(
  'error', mongooseErrorCallback);

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
// eslint-disable-next-line no-sync
const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swaggerDoc = load(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, (middleware: any) => {

  app.use((req: SwaggerRequestInterface, res: ServerResponse, next: (error?: Error) => void) => {
    let loggerContext = null;
    if (!isEmpty(req.headers) && !isEmpty(req.headers['x-request-id'])) {
      loggerContext = Logger.getContext(req.headers['x-request-id'] as string);
    } else {
      loggerContext = Logger.getContext(null);
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
  app.use((req: SwaggerRequestInterface, res: ServerResponse, next: (error?: Error) => void) => {
    // Allow the docs to load
    if (req.url.match(allowedRegex) || (!isEmpty(req.swagger.operation) && req.swagger.operation['x-public-operation'] === true)) {
      return next();
    }
    const jwtToken = req.headers['x-request-jwt'];
    if (!jwtToken) {
      return next(
        new RuntimeError('Missing required JWT header, update swagger api definition to make X-Request-JWT required')
      );
    }
    if (isEmpty(req.swagger.operation)) { // operation not supported, lets return.swagger will handle with 405.
      return next();
    }
    // Make sure octophant-event is configured correctly
    if (!req.swagger.operation['x-octophant-event'] && isEmpty(req.swagger.operation['x-octophant-event'])) {
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
  securityMetaData.jwt =
    (req: any, def: any, token: any, next: (error?: Error) => void) =>
      JWTSecurityHelper.jwtVerification(req, token, config.get('api_token'), next);
  // Set the methods that should be used for swagger security
  app.use(middleware.swaggerSecurity(securityMetaData));
  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Timezone serialization middleware
  app.use(timezoneMiddleware());

  app.use((err: any, req: any, res: any, next: (error?: Error) => void) => {
    ErrorHandler.onError(err, req, res, next);
  });

  // Start the server
  const server = http.createServer(app);
  server.setTimeout(config.get('server.timeout'));
  server.listen(serverPort, () => {
    // eslint-disable-next-line no-console
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    // eslint-disable-next-line no-console
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });

  const httpTerminator = createHttpTerminator({
    server,
    gracefulTerminationTimeout: config.get('graceful_shutdown.http.server_close_timeout')
  });
  const logger = Logger.getContext(null);
  const shutdown = async () => {
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
  };
  for (const signal of config.get<GenericObjectInterface>('graceful_shutdown').signals) {
    process.on(signal, shutdown);
  }
});
