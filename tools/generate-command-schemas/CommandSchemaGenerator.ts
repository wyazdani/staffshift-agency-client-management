import $RefParser from '@apidevtools/json-schema-ref-parser';
import {readdir, writeFile, rm, mkdir, access} from 'fs/promises';
import {keys, filter, endsWith, snakeCase, replace} from 'lodash';
import path from 'path';
import {Config} from 'ts-json-schema-generator';
import * as TSJ from 'ts-json-schema-generator';

/* eslint-disable no-console */
const AGGREGATES_FOLDER = path.resolve('src', 'aggregates');
const EXCLUDE_FOLDERS = ['types', 'command-schemas'];

/**
 * This script will read all *CommandInterface.ts files within the aggregates and generates json-schema per each command
 * Then we will use json-schemas to validate each command before executing them
 *
 * List of annotations you can use within interfaces are defined here:
 * https://github.com/vega/ts-json-schema-generator/blob/v1.1.2/src/AnnotationsReader/BasicAnnotationsReader.ts#L7
 */
export class CommandSchemaGenerator {
  static async execute(outputFolder: string): Promise<void> {
    // find aggregate names within the service
    const folders = await readdir(AGGREGATES_FOLDER, {withFileTypes: true});
    const aggregateNames = folders
      .filter((folder) => folder.isDirectory() && !EXCLUDE_FOLDERS.includes(folder.name))
      .map((folder) => folder.name);

    const schemas: {[key in string]: unknown} = {};

    for (const aggregateName of aggregateNames) {
      console.log(`Processing aggregate ${aggregateName}`);
      const dir = path.resolve(AGGREGATES_FOLDER, aggregateName, 'types', '**', '*CommandInterface.ts');
      const config: Config = {
        path: dir,
        tsconfig: './tsconfig.json'
      };
      const generator = TSJ.createGenerator(config);

      const allSchemas = generator.createSchema('*');
      const availableInterfaceNames = keys(allSchemas.definitions);
      const commandDataInterfaceNames = filter(availableInterfaceNames, (interfaceName) =>
        endsWith(interfaceName, 'CommandDataInterface')
      );

      // generate command schema for each command
      for (const commandDataInterfaceName of commandDataInterfaceNames) {
        const schema = generator.createSchema(commandDataInterfaceName);
        const commandName = snakeCase(replace(commandDataInterfaceName, 'CommandDataInterface', ''));

        // removing because of [{"code":"UNRESOLVABLE_REFERENCE","params":["http://json-schema.org/draft-07/schema#"],"message":"Reference could not be resolved: http://json-schema.org/draft-07/schema#","path":"#/"}]
        delete schema.$schema;
        schemas[commandName] = schema;
      }
    }

    await this.clearOutput(outputFolder);

    const indexImport = keys(schemas)
      .sort()
      .map((commandName) => `import ${commandName} from './${commandName}.json';`)
      .join('\n');
    const mapCommands = keys(schemas)
      .sort()
      .map((commandName) => `  ${commandName}`)
      .join(',\n');

    // write command json schema into .json files
    for (const commandName in schemas) {
      try {
        await writeFile(
          path.resolve(outputFolder, `${commandName}.json`),
          JSON.stringify(schemas[commandName], null, 2)
        );
      } catch (err) {
        console.error(`Error while writing file for CMD:${commandName}`, err);
        process.exit(1);
      }
    }

    await writeFile(
      path.resolve(outputFolder, 'index.ts'),
      `// DO NOT TOUCH THIS FILE MANUALLY, USE 'npm run dev-generate-command-schemas'
${indexImport}

const commandSchemas: {[key in string]: unknown} = {
${mapCommands}
};

export default commandSchemas;
`
    );
    console.log('script done');
    return;
  }

  /**
   * Removes existing output folder and creates an empty one
   */
  private static async clearOutput(path: string): Promise<void> {
    // delete existing command schema folder
    if (await this.pathExists(path)) {
      await rm(path, {recursive: true});
    }
    // create command schema folder
    await mkdir(path);
  }

  /**
   * checks if the file exists
   */
  private static async pathExists(path: string): Promise<boolean> {
    try {
      await access(path);
      return true;
    } catch (error) {
      return false;
    }
  }
}
