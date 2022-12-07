import sinon, {StubbedInstance, stubConstructor} from 'ts-sinon';
import {AgencyClientLinkStatus} from '../../src/domain-events-processors/AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {FacadeClientHelper} from '../../src/helpers/FacadeClientHelper';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {UnlinkAgencyClientCommandInterface} from '../../src/aggregates/AgencyClient/types/CommandTypes';
import {AgencyClientCommandEnum} from '../../src/aggregates/AgencyClient/types';

describe('AgencyClientLinkStatus', () => {
  let logger: LoggerContext;
  let commandBus: StubbedInstance<CommandBus>;
  let facadeClientHelper: StubbedInstance<FacadeClientHelper>;
  let agencyClientLinkStatus: AgencyClientLinkStatus;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    commandBus = stubConstructor(CommandBus);
    facadeClientHelper = stubConstructor(FacadeClientHelper);
    agencyClientLinkStatus = new AgencyClientLinkStatus(logger, commandBus, facadeClientHelper);
  });

  describe('apply()', () => {
    const agencyId = '6156fec03e1063fb47ffd642';
    const clientId = '6156fedd3e1063fb47ffd647';

    it('test event agency_organisation_link_deleted', async () => {
      const message = {
        event: {
          name: 'agency_organisation_link_deleted',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: clientId
        },
        application_jwt: 'token'
      };
      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'unlink_agency_client',
        data: {
          client_type: 'organisation'
        }
      };

      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });

    it('test event agency_organisation_site_link_deleted', async () => {
      const message = {
        event: {
          name: 'agency_organisation_site_link_deleted',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: '12345',
          site_id: clientId
        },
        application_jwt: 'token'
      };

      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'unlink_agency_client',
        data: {
          organisation_id: '12345',
          client_type: 'site'
        }
      };

      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });

    it('test event agency_organisation_site_ward_link_deleted', async () => {
      const message = {
        event: {
          name: 'agency_organisation_site_ward_link_deleted',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: '12345',
          site_id: '57689',
          ward_id: clientId
        },
        application_jwt: 'token'
      };

      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'unlink_agency_client',
        data: {
          organisation_id: '12345',
          site_id: '57689',
          client_type: 'ward'
        }
      };

      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });

    it('test event agency_organisation_link_status_changed', async () => {
      const message = {
        event: {
          name: 'agency_organisation_link_status_changed',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: clientId
        },
        application_jwt: 'token'
      };

      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'unlink_agency_client',
        data: {
          client_type: 'organisation'
        }
      };

      facadeClientHelper.getAgencyClientDetails.resolves([
        {
          _id: 'string',
          organisation_name: 'name',
          organisation_id: '12345',
          agency_name: 'string',
          agency_id: '6789',
          agency_org_type: 'org type',
          agency_linked: false
        }
      ]);
      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });

    it('test event agency_organisation_link_created', async () => {
      const message = {
        event: {
          name: 'agency_organisation_link_created',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: clientId
        },
        application_jwt: 'token'
      };

      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'link_agency_client',
        data: {
          client_type: 'organisation'
        }
      };

      facadeClientHelper.getAgencyClientDetails.resolves([
        {
          _id: 'string',
          organisation_name: 'name',
          organisation_id: '12345',
          agency_name: 'string',
          agency_id: '6789',
          agency_org_type: 'org type',
          agency_linked: true
        }
      ]);
      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });

    it('test event agency_organisation_site_link_status_changed', async () => {
      const message = {
        event: {
          name: 'agency_organisation_site_link_status_changed',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: '12345',
          site_id: clientId
        },
        application_jwt: 'token'
      };
      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'link_agency_client',
        data: {
          organisation_id: '12345',
          client_type: 'site'
        }
      };

      facadeClientHelper.getAgencyClientDetails.resolves([
        {
          _id: 'string',
          organisation_name: 'name',
          organisation_id: '12345',
          agency_name: 'string',
          agency_id: agencyId,
          agency_org_type: 'org type',
          agency_linked: true
        }
      ]);
      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });

    it('test event agency_organisation_site_ward_link_status_changed', async () => {
      const message = {
        event: {
          name: 'agency_organisation_site_ward_link_status_changed',
          id: '11111',
          date_created: new Date()
        },
        event_data: {
          _id: '123',
          agency_id: agencyId,
          organisation_id: '12345',
          site_id: '57689',
          ward_id: clientId
        },
        application_jwt: 'token'
      };
      const expectedCommand = {
        aggregateId: {
          agency_id: agencyId,
          client_id: clientId
        },
        type: 'link_agency_client',
        data: {
          organisation_id: '12345',
          site_id: '57689',
          client_type: 'ward'
        }
      };

      facadeClientHelper.getAgencyClientDetails.resolves([
        {
          _id: 'string',
          organisation_name: 'name',
          organisation_id: '12345',
          agency_name: 'string',
          agency_id: agencyId,
          agency_org_type: 'org type',
          agency_linked: true
        }
      ]);
      commandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      commandBus.execute.should.have.been.calledOnceWith(expectedCommand);
    });
  });
});
