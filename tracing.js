'use strict';
const config = require('config');

const keyFile = config.get('tracing.key_file');

const enhancedMongodbReporting = config.get('tracing.enhanced_mongodb_reporting');

const serviceName = require('./package.json').name;

const ignorePaths = ['/v1/status'];

const {TraceExporter} = require('@google-cloud/opentelemetry-cloud-trace-exporter');

const {registerInstrumentations} = require('@opentelemetry/instrumentation');

const {HttpInstrumentation} = require('@opentelemetry/instrumentation-http');

const {MongoDBInstrumentation} = require('@opentelemetry/instrumentation-mongodb');

const {NodeTracerProvider} = require('@opentelemetry/node');

const {BatchSpanProcessor} = require('@opentelemetry/tracing');

function setSpanName(span, request) {
  if (request.swagger && request.swagger.apiPath) {
    span.updateName(`${request.method} ${request.headers.host}${request.swagger.apiPath}`);
  } else {
    if (request.host) {
      span.updateName(`${request.method} ${request.host}${request.path}`);
    }
  }
}

const provider = new NodeTracerProvider();

provider.register();
registerInstrumentations({
  tracerProvider: provider,
  instrumentations: [
    new HttpInstrumentation({
      serverName: serviceName,
      applyCustomAttributesOnSpan: (span, request) => setSpanName(span, request),
      ignoreIncomingPaths: ignorePaths
    }),
    new MongoDBInstrumentation({
      enhancedDatabaseReporting: enhancedMongodbReporting
    })
  ]
});
const exporter = new TraceExporter({
  ...(keyFile && {keyFile})
});

provider.addSpanProcessor(new BatchSpanProcessor(exporter));
