import {events, EventsEnum} from '../Events';
import * as fs from 'fs';
import path from 'path';
import * as TSJ from 'ts-json-schema-generator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const deRef = (definitions: any, reference: string) => definitions[reference.split('/').pop()];

//https://github.com/vega/ts-json-schema-generator
/** @type {import('ts-json-schema-generator/dist/src/Config').Config} */
const config = {
  path: './src/types/EventTypes/*',
  tsconfig: './tsconfig.json',
  type: '*' // Or <type-name> if you want to generate schema for that one type only
};
const schema = TSJ.createGenerator(config).createSchema(config.type);

let generatedSection = '';

//Generated Header
generatedSection += '<!--DATA_START-->\n';
//Set the table headings
generatedSection += '<table>';
generatedSection +=
  '<tr><td> Event Code </td><td> Event Type </td><td> Event Data </td><td> Event Aggregate </td><td> Description </td></tr> \n';

for (const [eventEnum, eventName] of Object.entries(EventsEnum)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event: any = schema.definitions[`${eventName}EventInterface`];

  if (!event) {
    // eslint-disable-next-line no-console
    console.error(`Event interfaces not correctly defined for ${eventName}`);
    process.exit(1);
  }
  let eventDataContent = '\n\n```json\n' + JSON.stringify(event.properties.data, null, 2) + '\n```\n\n';
  let eventAggregateContent = '\n\n```json\n' + JSON.stringify(event.properties.aggregate_id, null, 2) + '\n```\n\n';

  if (event.properties.data && event.properties.data['$ref']) {
    eventDataContent =
      '\n\n```json\n' + JSON.stringify(deRef(schema.definitions, event.properties.data['$ref']), null, 2) + '\n```\n\n';
  }

  if (event.properties.aggregate_id && event.properties.aggregate_id['$ref']) {
    eventAggregateContent =
      '\n\n```json\n' +
      JSON.stringify(deRef(schema.definitions, event.properties.aggregate_id['$ref']), null, 2) +
      '\n```\n\n';
  }

  generatedSection += `<tr><td> ${eventEnum} </td><td> ${eventName} </td><td> ${eventDataContent} </td><td> ${eventAggregateContent} </td><td> ${events[eventName].description} </td></tr>\n`;
}

//Generated Footer
generatedSection += '</table>';
generatedSection += '<!--DATA_END-->';

//Read the content of the Events.md file
const readmeContent = fs.readFileSync(path.join(__dirname, '../../Events.md'), 'utf8');

//Replace the table between tokens
const newReadmeContent = readmeContent.replace(/<!--DATA_START-->[^]*<!--DATA_END-->/g, generatedSection);

fs.writeFileSync(path.join(__dirname, '../../Events.md'), newReadmeContent);

// eslint-disable-next-line no-console
console.log('Event documentation generation has completed');
process.exit(0);
