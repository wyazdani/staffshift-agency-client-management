import {FacadeClientHelper, FacadeClientRecordInterface} from '../../src/helpers/FacadeClientHelper';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import StaffshiftFacadeClient from 'a24-node-staffshift-facade-client';
import {ValidationError, AuthorizationError, RuntimeError} from 'a24-node-error-utils';

describe('FacadeClientHelper Class', () => {
  let logger: LoggerContext;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });

  describe('getAgencyClientDetails()', () => {
    it('test for validation error when downstream returns 400 status code', async () => {
      const apiResponse = {
        statusCode: 400,
        body: {
          code: 'MODEL_VALIDATION_FAILED',
          message: 'some validation message'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined)
        .should.be.rejectedWith(ValidationError, 'some validation message');
    });

    it('test for authorization error when downstream returns 401 status code', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'Invalid token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined)
        .should.be.rejectedWith(AuthorizationError, 'Invalid token specified');
    });

    it('test it resolves successfully when downstream returns 404', async () => {
      const apiResponse = {
        statusCode: 404
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      const result = await client.getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined);

      assert.isUndefined(result, 'result should be undefined on 404');
    });

    it('test for validation when downstream returns 401 status code', async () => {
      const apiResponse = {
        statusCode: 500,
        body: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined)
        .should.be.rejectedWith(RuntimeError, 'Internal server error');
    });

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
