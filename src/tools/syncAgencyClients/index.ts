import config from 'config';
import Logger from 'a24-logzio-winston';
import {FacadeClientHelper} from '../../helpers/FacadeClientHelper';
import {EventStore} from '../../models/EventStore';
import {connect, disconnect} from 'mongoose';
import {EventRepository} from '../../EventRepository';
import {AgencyClientCommandEnum, AgencyClientCommandInterface} from '../../AgencyClient/types';
import {AgencyClientCommandBusFactory} from '../../factories/AgencyClientCommandBusFactory';
import {MongoConfigurationInterface} from 'MongoConfigurationInterface';
import {AgencyRepository} from '../../Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../Agency/AgencyWriteProjectionHandler';

Logger.setup(config.get('logger'));
const loggerContext = Logger.getContext();
const client = new FacadeClientHelper(loggerContext);
const eventRepository = new EventRepository(EventStore, loggerContext.requestId, {user_id: 'system'});
const commandBus = AgencyClientCommandBusFactory.getCommandBus(
  eventRepository,
  new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler())
);

const itemsPerPage = 100;

interface SyncCommandInterface {
  command: AgencyClientCommandInterface;
  clientId: string;
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
    loggerContext.info('Connecting to the database');
    await connect(
      config.get<MongoConfigurationInterface>('mongo').database_host,
      config.get<MongoConfigurationInterface>('mongo').options
    );
    let completed = false;

    loggerContext.info('Starting the sync agency client process');

    do {
      const itemsCompleted = await syncAgencyClients(page);

      completed = itemsCompleted !== itemsPerPage;
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

    await commandBus.execute(item.agency_id, details.clientId, details.command);
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
const getSyncCommandDetails = (agencyClientLink: any): SyncCommandInterface => {
  switch (agencyClientLink.agency_org_type) {
    case 'organisation':
      return {
        command: {
          type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT,
          data: {
            client_type: 'organisation',
            linked: agencyClientLink.agency_linked,
            linked_at: new Date(agencyClientLink.created_at)
          }
        },
        clientId: agencyClientLink.organisation_id
      };
    case 'site':
      return {
        command: {
          type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT,
          data: {
            organisation_id: agencyClientLink.organisation_id,
            client_type: 'site',
            linked: agencyClientLink.agency_linked,
            linked_at: new Date(agencyClientLink.created_at)
          }
        },
        clientId: agencyClientLink.site_id
      };
    case 'ward':
      return {
        command: {
          type: AgencyClientCommandEnum.SYNC_AGENCY_CLIENT,
          data: {
            organisation_id: agencyClientLink.organisation_id,
            site_id: agencyClientLink.site_id,
            client_type: 'ward',
            linked: agencyClientLink.agency_linked,
            linked_at: new Date(agencyClientLink.created_at)
          }
        },
        clientId: agencyClientLink.ward_id
      };
    default:
      throw new Error(`Unexpected agency organisation type received: ${agencyClientLink.agency_org_type}`);
  }
};
const page = process.argv[2] ? parseInt(process.argv[2]) : 1;

run(page)
  .then(() => disconnect())
  .then(() => {
    loggerContext.info('The script has completed and does NOT need to be re-run');
  })
  .catch((err) => {
    loggerContext.error('Script did not complete, you will need to rerun it', err);
    process.exit(1);
  });
