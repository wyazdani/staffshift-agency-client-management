const config = require('config');
const Logger = require('a24-logzio-winston');
import {FacadeClientHelper} from '../../helpers/FacadeClientHelper';
import {AgencyClientRepository} from '../../AgencyClient/AgencyClientRepository';
import {EventStore} from '../../models/EventStore';
import {AgencyClientCommandHandler} from '../../AgencyClient/AgencyClientCommandHandler';
import {connect, disconnect} from 'mongoose';

Logger.setup(config.logger);
const loggerContext = Logger.getContext('syncAgencyClients');
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
    await connect(config.mongo.database_host, config.mongo.options);
    let completed = false;
    do {
      const itemsCompleted = await syncAgencyClients(page);
      completed = (itemsCompleted !== itemsPerPage);
      loggerContext.info(`Completed page: ${page} with an items per page of: ${itemsPerPage}`);
      page++;
    } while (completed === false);
  } catch (err) {
    loggerContext.error('There was an error while syncing agency clients', err);
    throw err;
  }
}

async function syncAgencyClients(page: number): Promise<number> {
  const options = {
    xRequestId: loggerContext.requestId,
    sortBy: ['_id'],
    page,
    itemsPerPage
  };
  const response = await client.getAgencyClientDetailsListing(options);
  for (const item of response) {
    const details = getSyncCommandDetails(item);
    await handler.apply(item.agency_id, details.client_id, details.command);
  }
  return response.length;
}

function getSyncCommandDetails(agencyClientLink: any) {
  const details: any = {
    command: {
      type: 'syncAgencyClient'
    }
  };

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

const page = (process.argv[2]) ? parseInt(process.argv[2]) : 1;

run(page).then(() => {
  return disconnect();
}).then(() => {
  loggerContext.info('The script has completed and does NOT need to be re-run');
}).catch((err) => {
  loggerContext.error('Script did not complete, you will need to rerun it', err);
  process.exit(1);
});