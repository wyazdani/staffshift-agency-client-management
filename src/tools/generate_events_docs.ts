import {events, EventsEnum} from '../Events';
import * as fs from 'fs';
import path from 'path';

//Set the table headings
let tableString = '<!--DATA_START-->\n| Event Code | Event Type | Description |\n| --- | --- | --- |\n';

for (const [eventEnum, eventName] of Object.entries(EventsEnum)) {
  tableString += `| ${eventEnum} | ${eventName} | ${events[eventName].description} |\n`;
}

tableString += '<!--DATA_END-->';

//Read the content of the Events.md file
const readmeContent = fs.readFileSync(path.join(__dirname, '../../Events.md'), 'utf8');

//Replace the table between tokens
const newReadmeContent = readmeContent.replace(/<!--DATA_START-->[^]*<!--DATA_END-->/g, tableString);

fs.writeFileSync(path.join(__dirname, '../../Events.md'), newReadmeContent);
