'use strict';

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
const _ = require('lodash');
const serverPort = (config.has('server.port')) ? config.get('server.port') : 3370;
const mongoose = require('mongoose');
mongoose.plugin((schema) => { schema.options.usePushEach = true; });
const {mongooseTimezone, timezoneMiddleware} = require('a24-node-timezone-utils');
mongoose.plugin(mongooseTimezone);
mongoose.Promise = global.Promise;
const {MessagePublisher} = require('a24-node-pubsub');
const JWTSecurityHelper = require('./helpers/JWTSecurityHelper');
const {Auditor} = require('a24-node-octophant-utils');
const pubsubAuditConfig = {
  env: process.env.NODE_ENV || 'development',
  auth: config.get('octophant_audit.pubsub_project'),
  topics: config.get('octophant_audit.pubsub_topics')
};
MessagePublisher.configure(pubsubAuditConfig);
// Allow any calls on /docs and /api-docs
const allowedRegex = '^/docs.*|^/api-docs.*';
// swaggerRouter configuration
const options = {
  swaggerUi: '/swagger.json',
  controllers: './controllers',
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

const errorHandlerConfig = {
  client_errors: config.get('client_errors')
};
A24ErrorUtils.configure(errorHandlerConfig);

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error) {
    let loggerContext = Logger.getContext('startup');
    loggerContext.crit('MongoDB connection error', error);
    process.exit(1);
  }
);

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
// eslint-disable-next-line no-sync
const spec = fs.readFileSync('./api/swagger.yaml', 'utf8');
const swaggerDoc = jsyaml.safeLoad(spec);

// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function middleWareFunc(middleware) {

  app.use(function initUse(req, res, next) {
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

  let securityMetaData = {};
  app.use(function configureAuditorContext(req, res, next) {
    // Allow the docs to load
    if (req.url.match(allowedRegex) || (!_.isEmpty(req.swagger.operation) && req.swagger.operation['x-public-operation'] === true)) {
      return next();
    }
    let jwtToken = req.headers['x-request-jwt'];
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
    let publisher = new MessagePublisher(req.Logger);
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
  securityMetaData.jwt = function validateJWT(req, def, token, next) {
    return JWTSecurityHelper.jwtVerification(req, token, config.api_token, next);
  };
  // Set the methods that should be used for swagger security
  app.use(middleware.swaggerSecurity(securityMetaData));
  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  app.use(middleware.swaggerUi());

  // Timezone serialization middleware
  app.use(timezoneMiddleware());

  app.use(function errorHandler(err, req, res, next) {
    ErrorHandler.onError(err, req, res, next);
  });

  // Start the server
  http.createServer(app).listen(serverPort, function createFunc() {
    // eslint-disable-next-line no-console
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    // eslint-disable-next-line no-console
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
  });
});
