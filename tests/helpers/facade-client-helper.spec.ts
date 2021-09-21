import {FacadeClientHelper, FacadeClientRecordInterface} from '../../src/helpers/FacadeClientHelper';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import StaffshiftFacadeClient from 'a24-node-staffshift-facade-client';

describe('FacadeClientHelper Class', () => {
  let logger: typeof LoggerContext;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => {
    sinon.restore();
  });

  describe('getAgencyClientDetails()', () => {
    it('success scenario', async () => {
      const record: FacadeClientRecordInterface = {
        _id: 'string',
        organisation_name: 'string',
        organisation_id: 'string',
        agency_name: 'string',
        agency_id: 'string',
        agency_org_type: 'string',
        agency_linked: true
      };

      const apiResponse = {
        body: [record]
      };

      const client = new FacadeClientHelper(logger);

      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(null, apiResponse, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({
        listAgencyOrganisationLink
      });
      const result = await client.getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined, {
        xRequestId: logger.requestId
      });

      assert.equal(result, apiResponse.body);
      assert.equal(listAgencyOrganisationLink.callCount, 1, 'listAgencyOrganisationLink not called');
    });
  });
});
