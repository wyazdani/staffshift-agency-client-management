import path from 'path';
import {CommandSchemaGenerator} from './CommandSchemaGenerator';

const OUTPUT_FOLDER = path.resolve('src', 'aggregates', 'command-schemas');

(async () => {
  await CommandSchemaGenerator.execute(OUTPUT_FOLDER);
})();
