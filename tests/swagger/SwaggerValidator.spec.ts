import * as path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';
import * as _ from 'lodash';
import flat from 'flat';
const swaggerFile = path.resolve(__dirname, '..', '..', 'api', 'swagger.yaml');

describe('SwaggerValidator', () => {
  it('Test all objects schemas should have additionalProperties set', async () => {
    const api = await SwaggerParser.validate(swaggerFile);
    const apiObj: any = flat(api.paths);
    const listOfErrors = [];

    for (const key in apiObj) {
      const typeKey = '.schema.type';

      if (_.endsWith(key, typeKey)) {
        if (apiObj[key] === 'object') {
          const additionalKey = key.substring(0, key.length - typeKey.length) + '.schema.additionalProperties';

          if (!_.has(apiObj, additionalKey)) {
            listOfErrors.push(additionalKey);
          }
        }
      }
    }

    if (!_.isEmpty(listOfErrors)) {
      throw new Error('These fields should be defined in swagger.yaml file: \n' + listOfErrors.join('\n'));
    }
  });
});
