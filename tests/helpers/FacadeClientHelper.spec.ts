import {FacadeClientHelper} from '../../src/helpers/FacadeClientHelper';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';
import sinon from 'sinon';
import {assert} from 'chai';
import {LoggerContext} from 'a24-logzio-winston';
import StaffshiftFacadeClient, {
  AgencyOrganisationLinkDataType,
  UserDetailsDataType,
  ApiClient,
  ListAgencyOrgLinkOptionsType

} from 'a24-node-staffshift-facade-client';
import {ValidationError, AuthorizationError, RuntimeError, ResourceNotFoundError} from 'a24-node-error-utils';

describe('FacadeClientHelper Class', () => {
  let logger: LoggerContext;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });

  describe('getAgencyClientDetails()', () => {

    it('runtime error is thrown when getting error without a response', async () => {
      const apiResponse = {
        statusCode: 500,
        body: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, null);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', 'ward id')
        .should.be.rejectedWith(RuntimeError, 'An error occurred during the agency client data get call');
    });

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

    it('test for validation error when downstream returns 400 status code with site id and no ward id', async () => {
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

    it('test for validation error when downstream returns 400 status code with ward id and no site id', async () => {
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
        .getAgencyClientDetails('agency id', 'organisation id', undefined, 'ward id')
        .should.be.rejectedWith(ValidationError, 'some validation message');
    });

    it('test for validation error when downstream returns 400 status code with both ward id and site id', async () => {
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
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', 'ward id')
        .should.be.rejectedWith(ValidationError, 'some validation message');
    });

    it('test for authorization error when downstream returns 401 status code', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'API token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined)
        .should.be.rejectedWith(AuthorizationError, 'API token specified');
    });

    it('test for authorization error when downstream returns 401 status code with site id and no ward id', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'API token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', undefined)
        .should.be.rejectedWith(AuthorizationError, 'API token specified');
    });

    it('test for authorization error when downstream returns 401 status code with ward id and no site id', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'API token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', undefined, 'ward id')
        .should.be.rejectedWith(AuthorizationError, 'API token specified');
    });

    it('test for authorization error when downstream returns 401 status code with both ward id and site id', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'API token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', 'ward id')
        .should.be.rejectedWith(AuthorizationError, 'API token specified');
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

    it('test it resolves successfully when downstream returns 404 with site id and no ward id', async () => {
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

    it('test it resolves successfully when downstream returns 404 with ward id and no site id', async () => {
      const apiResponse = {
        statusCode: 404
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      const result = await client.getAgencyClientDetails('agency id', 'organisation id', undefined, 'ward id');

      assert.isUndefined(result, 'result should be undefined on 404');
    });

    it('test it resolves successfully when downstream returns 404 with both ward id and site id', async () => {
      const apiResponse = {
        statusCode: 404
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      const result = await client.getAgencyClientDetails('agency id', 'organisation id', 'site id', 'ward id');

      assert.isUndefined(result, 'result should be undefined on 404');
    });

    it('test for validation when downstream returns 500 status code', async () => {
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

    it('test for validation when downstream returns 500 status code with site id and no ward id', async () => {
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

    it('test for validation when downstream returns 500 status code with ward id and no site id', async () => {
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
        .getAgencyClientDetails('agency id', 'organisation id', undefined, 'ward id')
        .should.be.rejectedWith(RuntimeError, 'Internal server error');
    });

    it('test for validation when downstream returns 500 status code with both ward id and site id', async () => {
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
        .getAgencyClientDetails('agency id', 'organisation id', 'site id', 'ward id')
        .should.be.rejectedWith(RuntimeError, 'Internal server error');
    });

    it('success scenario', async () => {
      const record: AgencyOrganisationLinkDataType = {
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

    it('success scenario with site id and no ward id', async () => {
      const record: AgencyOrganisationLinkDataType = {
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

    it('success scenario with ward id and no site id', async () => {
      const record: AgencyOrganisationLinkDataType = {
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
      const result = await client.getAgencyClientDetails('agency id', 'organisation id', undefined, 'ward id', {
        xRequestId: logger.requestId
      });

      assert.equal(result, apiResponse.body);
      assert.equal(listAgencyOrganisationLink.callCount, 1, 'listAgencyOrganisationLink not called');
    });

    it('success scenario with both site id and ward id', async () => {
      const record: AgencyOrganisationLinkDataType = {
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
      const result = await client.getAgencyClientDetails('agency id', 'organisation id', 'site id', 'ward id', {
        xRequestId: logger.requestId
      });

      assert.equal(result, apiResponse.body);
      assert.equal(listAgencyOrganisationLink.callCount, 1, 'listAgencyOrganisationLink not called');
    });
    
  });

  describe('getUserFullName()', () => {
    const userId = 'user id';
    const error = new Error('custom');

    it('success scenario', async () => {
      const record: UserDetailsDataType = {
        user_id: userId,
        first_name: 'first name',
        last_name: 'last name'
      };
      const apiResponse = {
        body: record
      };
      const client = new FacadeClientHelper(logger);
      const getUserDetails = sinon.spy((_userId, _authorization, _options, clb) => {
        _userId.should.equal(userId);
        clb(null, apiResponse, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'UserApi').returns({
        getUserDetails
      });
      const fullName = await client.getUserFullName(userId);

      fullName.should.equal('first name last name');
    });
    it('test for validation error when downstream returns 400 status code', async () => {
      const apiResponse = {
        statusCode: 400,
        body: {
          code: 'MODEL_VALIDATION_FAILED',
          message: 'some validation message'
        }
      };
      const client = new FacadeClientHelper(logger);
      const getUserDetails = sinon.spy((_userId, _authorization, _options, clb) => {
        _userId.should.equal(userId);
        clb(error, apiResponse, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'UserApi').returns({getUserDetails});
      await client.getUserFullName(userId).should.be.rejectedWith(ValidationError, 'some validation message');
    });

    it('test for authorization error when downstream returns 401 status code', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'API token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const getUserDetails = sinon.spy((_userId, _authorization, _options, clb) => {
        _userId.should.equal(userId);
        clb(error, apiResponse, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'UserApi').returns({getUserDetails});
      await client.getUserFullName(userId).should.be.rejectedWith(AuthorizationError, 'API token specified');
    });

    it('test it resolves successfully when downstream returns 404', async () => {
      const apiResponse = {
        statusCode: 404
      };
      const client = new FacadeClientHelper(logger);
      const getUserDetails = sinon.spy((_userId, _authorization, _options, clb) => {
        _userId.should.equal(userId);
        clb(error, apiResponse, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'UserApi').returns({getUserDetails});
      await client.getUserFullName(userId).should.be.rejectedWith(ResourceNotFoundError, 'User not found');
    });

    it('test for validation when downstream returns 500 status code', async () => {
      const apiResponse = {
        statusCode: 500,
        body: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error'
        }
      };
      const client = new FacadeClientHelper(logger);
      const getUserDetails = sinon.spy((_userId, _authorization, _options, clb) => {
        _userId.should.equal(userId);
        clb(error, apiResponse, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'UserApi').returns({getUserDetails});
      await client
        .getUserFullName(userId)
        .should.be.rejectedWith(RuntimeError, 'An error occurred during getUserDetails get call');
    });
    
    it('runtime error is thrown when getting error without a response', async () => {
      const apiResponse = {
        statusCode: 500,
        body: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error'
        }
      };
      const client = new FacadeClientHelper(logger);
      const getUserDetails = sinon.spy((_userId, _authorization, _options, clb) => {
        _userId.should.equal(userId);
        clb(error, apiResponse, null);
      });

      sinon.stub(StaffshiftFacadeClient, 'UserApi').returns({getUserDetails});
      await client
        .getUserFullName(userId)
        .should.be.rejectedWith(RuntimeError, 'Error occurred during user details GET call');
    });

  });

  describe('getAgencyClientDetailsListing()', () => {

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
        .getAgencyClientDetailsListing()
        .should.be.rejectedWith(ValidationError, 'some validation message');
    });

    it('test for authorization error when downstream returns 401 status code', async () => {
      const apiResponse = {
        statusCode: 401,
        body: {
          code: 'UNAUTHORIZED',
          message: 'API token specified'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetailsListing()
        .should.be.rejectedWith(AuthorizationError, 'API token specified');
    });

    it('test it resolves successfully when downstream returns 404 ', async () => {
      const apiResponse = {
        statusCode: 404
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, apiResponse);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      const result = await client.getAgencyClientDetailsListing();

      assert.isUndefined(result, 'result should be undefined on 404');
    });

    it('test for validation when downstream returns 500 status code', async () => {
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
        .getAgencyClientDetailsListing()
        .should.be.rejectedWith(RuntimeError, 'Internal server error');
    });

    it('success scenario', async () => {
      const record: AgencyOrganisationLinkDataType = {
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
      const result = await client.getAgencyClientDetailsListing( {
        xRequestId: logger.requestId
      });

      assert.equal(result, apiResponse.body);
      assert.equal(listAgencyOrganisationLink.callCount, 1, 'listAgencyOrganisationLink not called');
    });

    it('runtime error is thrown when getting error without a response', async () => {
      const apiResponse = {
        statusCode: 500,
        body: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Internal server error'
        }
      };
      const client = new FacadeClientHelper(logger);
      const listAgencyOrganisationLink = sinon.spy((_authorization, _options, clb) => {
        clb(apiResponse, null, null);
      });

      sinon.stub(StaffshiftFacadeClient, 'AgencyOrganisationLinkApi').returns({listAgencyOrganisationLink});
      await client
        .getAgencyClientDetailsListing()
        .should.be.rejectedWith(RuntimeError, 'An error occurred during the agency client data get call');
    })
  });
});
