'use strict';
//IMPORTANT If you're getting errors while running this file, try adding this --stack-size=16000 when running the file

const stt = require('swagger-test-templates');
const yaml = require('js-yaml');
const fs = require('fs');
const path = './tests/endpoint/';
const deref = require('json-schema-deref');
let reffedSwagger, swagger;
const config = {
  assertionFormat: 'should',
  testModule: 'supertest',
  pathName: [],
  //  loadTest: [{pathName:'/user', operation:'get', load:{requests: 1000, concurrent: 100}}, { /* ... */ }],
  maxLen: 80
};

// Get document, or throw exception on error
try {
  // eslint-disable-next-line no-sync
  reffedSwagger = yaml.safeLoad(fs.readFileSync('./api/swagger.yaml', 'utf8'));
} catch (e) {
  // eslint-disable-next-line no-console
  console.log(e);
  console.log(e)

  return;
}

// Temporary DeRef the JSON references, until https://github.com/apigee-127/swagger-test-templates/issues/92 is resolved
deref(reffedSwagger, (err, swagerDef) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.log(err);

    return;
  }

  swagger = swagerDef;

  // Generates an array of JavaScript test files following specified configuration
  const arrTests = stt.testGen(swagger, config);
console.log(arrTests)
  for (let i = 0; i < arrTests.length; i++) {
    // eslint-disable-next-line no-sync
    fs.writeFileSync(path + arrTests[i].name, arrTests[i].test, 'utf8');
  }
});
