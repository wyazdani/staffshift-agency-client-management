const config = require('config');
import {FacadeClientHelper} from '../../../src/helpers/FacadeClientHelper';
import {AgencyClientRepository} from '../../../src/AgencyClient/AgencyClientRepository';
import {EventStore} from '../../../src/models/EventStore';
import {AgencyClientCommandHandler} from '../../../src/AgencyClient/AgencyClientCommandHandler';
const Logger = require('a24-logzio-winston');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

Logger.setup(config.logger);
const loggerContext = Logger.getContext('syncAgencyClients');

mongoose.connect(config.mongo.database_host, config.mongo.options);
mongoose.connection.on(
  'error',
  function mongooseConnection(error: Error) {
    loggerContext.crit('MongoDB connection error', error);
    process.exit(1);
  }
);

const client = new FacadeClientHelper(loggerContext);
const repository = new AgencyClientRepository(EventStore);
const handler = new AgencyClientCommandHandler(repository);

const itemsPerPage = 20;

/**
 * Runs the process that selects data from facade and creates a syncAgencyClient Command per item retrieved
 *
 * @param page - The page that we should start at
 */
async function run(page: number) {
  try {
    let completed = false;
    do {
      let itemsCompleted = await syncAgencyClients(page);
      completed = (itemsCompleted !== itemsPerPage);
      loggerContext.info(`Completed page: ${page} with an items per page of: ${itemsPerPage}`);
      page++;
    } while (completed === false)
  } catch (err) {
    loggerContext.error('There was an error while syncing agency clients', err);
    throw err;
  }
}

async function syncAgencyClients(page: number): Promise<number> {
  let options = {
    sortBy: ['_id'],
    page,
    itemsPerPage
  }
  let response = await client.getAgencyClientDetailsListing(options);
  for (let item of response) {
    let details = getSyncCommandDetails(item)
    await handler.apply(item.agency_id, details.client_id, details.command);
  }
  return response.length;
}

function getSyncCommandDetails(agencyClientLink: any) {
  let details: any = {
    command: {
      type: 'syncAgencyClient'
    }
  }

  switch (agencyClientLink.agency_org_type) {
    case 'organisation':
      details.command.data = {
        client_type: 'organisation',
        linked: agencyClientLink.agency_linked
      };
      details.client_id = agencyClientLink.organisation_id;
      return details;
    case 'site':
      details.command.data = {
        organisation_id: agencyClientLink.organisation_id,
        client_type: 'site',
        linked: agencyClientLink.agency_linked
      };
      details.client_id = agencyClientLink.site_id;
      return details;
    case 'ward':
      details.command.data = {
        organisation_id: agencyClientLink.organisation_id,
        site_id: agencyClientLink.site_id,
        client_type: 'ward',
        linked: agencyClientLink.agency_linked
      };
      details.client_id = agencyClientLink.ward_id;
      return details;
    default:
      throw new Error(`Unexpected agency organisation type received: ${agencyClientLink.agency_org_type}`);
  }
}

let page = (process.argv[2]) ? parseInt(process.argv[2]) : 1;

run(page).then(() => {
  loggerContext.info('The script has completed and does NOT need to be re-run');
  mongoose.connection.close();
}).catch((err) => {
  loggerContext.error('Script did not complete, you will need to rerun it', err);
  mongoose.connection.close();
  process.exit(1);
});