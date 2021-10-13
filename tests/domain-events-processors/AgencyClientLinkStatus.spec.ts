import sinon, {StubbedInstance, stubConstructor} from 'ts-sinon';
import {AgencyClientLinkStatus} from '../../src/domain-events-processors/AgencyClientLinkStatus';
import {LoggerContext} from 'a24-logzio-winston';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import {AgencyClientCommandBus} from '../../src/AgencyClient/AgencyClientCommandBus';
import {FacadeClientHelper} from '../../src/helpers/FacadeClientHelper';

describe('AgencyClientLinkStatus', () => {
  let logger: LoggerContext;
  let agencyClientCommandBus: StubbedInstance<AgencyClientCommandBus>;
  let facadeClientHelper: StubbedInstance<FacadeClientHelper>;
  let agencyClientLinkStatus: AgencyClientLinkStatus;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    agencyClientCommandBus = stubConstructor(AgencyClientCommandBus);
    facadeClientHelper = stubConstructor(FacadeClientHelper);
    agencyClientLinkStatus = new AgencyClientLinkStatus(logger, agencyClientCommandBus, facadeClientHelper);
  });

  describe('apply()', () => {
    const agencyId = '6156fec03e1063fb47ffd642';
    const clientId = '6156fedd3e1063fb47ffd647';

    it('should call command bus with correct command', async () => {
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
        type: 'unlinkAgencyClient',
        data: {
          client_type: 'organisation'
        }
      };

      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });

    it('should call command bus with correct command', async () => {
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
        type: 'unlinkAgencyClient',
        data: {
          organisation_id: '12345',
          client_type: 'site'
        }
      };

      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });

    it('should call command bus with correct command', async () => {
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
        type: 'unlinkAgencyClient',
        data: {
          organisation_id: '12345',
          site_id: '57689',
          client_type: 'ward'
        }
      };

      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });

    it('should call command bus with correct command', async () => {
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
        type: 'unlinkAgencyClient',
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
      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });

    it('should call command bus with correct command', async () => {
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
        type: 'linkAgencyClient',
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
      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });

    it('should call command bus with correct command', async () => {
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
        type: 'linkAgencyClient',
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
      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });

    it('should call command bus with correct command', async () => {
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
        type: 'linkAgencyClient',
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
      agencyClientCommandBus.execute.resolves();
      await agencyClientLinkStatus.apply(message);

      agencyClientCommandBus.execute.should.have.been.calledOnceWith(agencyId, clientId, expectedCommand);
    });
  });
});
