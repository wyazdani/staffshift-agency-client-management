import config from 'config';
import Logger from 'a24-logzio-winston';
import {FacadeClientHelper} from '../../helpers/FacadeClientHelper';
import {AgencyClientRepository} from '../../AgencyClient/AgencyClientRepository';
import {EventStore} from '../../models/EventStore';
import {AgencyClientCommandHandler} from '../../AgencyClient/AgencyClientCommandHandler';
import {connect, disconnect} from 'mongoose';
import {AgencyClientCommand} from '../../AgencyClient/Interfaces';
import {AgencyClientCommandEnum} from '../../AgencyClient/AgencyClientEnums';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext('syncAgencyClients');
const client = new FacadeClientHelper(loggerContext);
const repository = new AgencyClientRepository(EventStore);
const handler = new AgencyClientCommandHandler(repository);

const itemsPerPage = 250;

interface SyncCommand {
  command: AgencyClientCommand,
  clientId: string
}

/**
 * Connects to database, loops and does a per page sync until exhausted
 *
 * @param page - The page number that should be processed
 *
 * @returns void
 */
const run = async (page: number): Promise<void> => {
  try {
    await connect(config.get('mongo').database_host, config.get('mongo').options);
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
};

/**
 * Gets a single page listing of Agency Clients, applies the Sync Command for each item
 *
 * @param page - The page number that should be processed
 *
 * @returns Total Processed items - Should be the page size or less
 */
const syncAgencyClients = async (page: number): Promise<number> => {
  const options = {
    xRequestId: loggerContext.requestId,
    sortBy: ['_id'],
    page,
    itemsPerPage
  };
  const response = await client.getAgencyClientDetailsListing(options);
  for (const item of response) {
    const details = getSyncCommandDetails(item);
    await handler.apply(item.agency_id, details.clientId, details.command);
  }
  return response.length;
};

/**
 * Convert the agency client link into a specific sync command
 *
 * @param agencyClientLink - The agency client link details
 *
 * @returns A single SyncCommand
 */
const getSyncCommandDetails = (agencyClientLink: any): SyncCommand => {
  const details: SyncCommand = {
    command: {
      type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT,
      data: {}
    },
    clientId: ''
  };

  switch (agencyClientLink.agency_org_type) {
    case 'organisation':
      details.command.data = {
        client_type: 'organisation',
        linked: agencyClientLink.agency_linked
      };
      details.clientId = agencyClientLink.organisation_id;
      return details;
    case 'site':
      details.command.data = {
        organisation_id: agencyClientLink.organisation_id,
        client_type: 'site',
        linked: agencyClientLink.agency_linked
      };
      details.clientId = agencyClientLink.site_id;
      return details;
    case 'ward':
      details.command.data = {
        organisation_id: agencyClientLink.organisation_id,
        site_id: agencyClientLink.site_id,
        client_type: 'ward',
        linked: agencyClientLink.agency_linked
      };
      details.clientId = agencyClientLink.ward_id;
      return details;
    default:
      throw new Error(`Unexpected agency organisation type received: ${agencyClientLink.agency_org_type}`);
  }
};

const page = (process.argv[2]) ? parseInt(process.argv[2]) : 1;

run(page).then(() => disconnect()).then(() => {
  loggerContext.info('The script has completed and does NOT need to be re-run');
}).catch((err) => {
  loggerContext.error('Script did not complete, you will need to rerun it', err);
  process.exit(1);
});