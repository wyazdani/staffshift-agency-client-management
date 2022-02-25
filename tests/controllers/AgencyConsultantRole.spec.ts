import sinon from 'sinon';
import {
  addAgencyConsultantRole,
  updateAgencyConsultantRole,
  getAgencyConsultantRole,
  listAgencyConsultantRoles,
  enableAgencyConsultantRole,
  disableAgencyConsultantRole
} from '../../src/controllers/AgencyConsultantRole';
import {GenericRepository} from '../../src/GenericRepository';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {LocationHelper} from '../../src/helpers/LocationHelper';
import {ObjectID} from 'mongodb';
import {AgencyCommandBus} from '../../src/aggregates/Agency/AgencyCommandBus';
import {AgencyCommandEnum} from '../../src/aggregates/Agency/types';
import {ResourceNotFoundError, ValidationError} from 'a24-node-error-utils';
import {QueryHelper} from 'a24-node-query-utils';
import {PaginationHelper} from '../../src/helpers/PaginationHelper';

describe('AgencyConsultantRole', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('addAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const location = 'http://localhost/sample/a/b/c';
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        agency_consultant_role_payload: {
          value: {
            name: 'sample_name',
            description: 'some description',
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const setHeader = sinon.stub(res, 'setHeader');
      const end = sinon.stub(res, 'end');
      const getRelativeLocation = sinon.stub(LocationHelper, 'getRelativeLocation').returns(location);

      sinon.stub(ObjectID.prototype, 'toString').returns(roleId);

      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').resolves();

      await addAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.deepEqual(setHeader.getCall(0).args, ['Location', location], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      assert.equal(getRelativeLocation.getCall(0).args[0], `/agency/${agencyId}/consultant-roles/${roleId}`);
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          {
            type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
            data: {
              _id: roleId,
              name: 'sample_name',
              description: 'some description',
              max_consultants: 2
            }
          }
        ],
        'AgencyCommandBus.execute expected parameters failed'
      );
    });

    it('failure scenario', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        agency_consultant_role_payload: {
          value: {
            name: 'sample_name',
            description: 'some description',
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectID.prototype, 'toString').returns(roleId);
      const error = new Error('custom');
      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').rejects(error);

      await addAgencyConsultantRole(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called');
      assert.equal(next.getCall(0).args[0], error, 'Expected error to match');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          {
            type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
            data: {
              _id: roleId,
              name: 'sample_name',
              description: 'some description',
              max_consultants: 2
            }
          }
        ],
        'AgencyCommandBus.execute expected parameters failed'
      );
    });
  });

  describe('updateAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: roleId},
        agency_consultant_role_update_payload: {
          value: {
            name: 'sample_name',
            description: 'some description',
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').resolves();

      await updateAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledWith(agencyId, {
        type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
        data: {
          _id: roleId,
          name: 'sample_name',
          description: 'some description',
          max_consultants: 2
        }
      });
    });

    it('success scenario, partial update', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: roleId},
        agency_consultant_role_update_payload: {
          value: {
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').resolves();

      await updateAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledWith(agencyId, {
        type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
        data: {
          _id: roleId,
          max_consultants: 2
        }
      });
    });

    it('validation error for nothing to update', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: roleId},
        agency_consultant_role_update_payload: {
          value: {}
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute');

      await updateAgencyConsultantRole(req, res, next);
      assert.equal(end.callCount, 0, 'Expected end not to be called');
      assert.equal(next.callCount, 1, 'Expected next to be called');
      assert.equal(execute.callCount, 0, 'Expected execute to not be called');
      execute.should.not.have.been.called;
      assert.instanceOf(next.getCall(0).args[0], ValidationError, 'Expected error to be instance of Validation error');
    });

    it('failure scenario, ResourceNotFoundError', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: roleId},
        agency_consultant_role_update_payload: {
          value: {
            name: 'sample_name',
            description: 'some description',
            max_consultants: 2
          }
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const error = new ResourceNotFoundError('sample');
      const execute = sinon.stub(AgencyCommandBus.prototype, 'execute').rejects(error);

      await updateAgencyConsultantRole(req, res, next);
      next.should.have.been.calledWith(error);
      execute.should.have.been.calledWith(agencyId, {
        type: AgencyCommandEnum.UPDATE_AGENCY_CONSULTANT_ROLE,
        data: {
          _id: roleId,
          name: 'sample_name',
          description: 'some description',
          max_consultants: 2
        }
      });
    });
  });

  describe('getAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const agencyId = 'agency id';
      const consultantRoleId = 'consultant role id';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: consultantRoleId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const setHeader = sinon.stub(res, 'setHeader');
      const record: any = {
        _id: consultantRoleId,
        agency_id: agencyId,
        name: 'name',
        description: 'description',
        max_consultants: 2,
        status: 'enabled',
        toJSON: () => record
      };
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves(record);

      await getAgencyConsultantRole(req, res, next);
      findOne.should.have.been.calledWith({
        _id: consultantRoleId,
        agency_id: agencyId
      });
      setHeader.should.have.been.calledWith('Content-Type', 'application/json');
      end.should.have.been.calledWith(JSON.stringify(record));
    });

    it('resource not found scenario', async () => {
      const agencyId = 'agency id';
      const consultantRoleId = 'consultant role id';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: consultantRoleId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const setHeader = sinon.stub(res, 'setHeader');
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves();

      await getAgencyConsultantRole(req, res, next);
      findOne.should.have.been.calledWith({
        _id: consultantRoleId,
        agency_id: agencyId
      });
      setHeader.should.not.have.been.called;
      end.should.not.have.been.called;
      next.getCall(0).args[0].should.be.instanceOf(ResourceNotFoundError);
    });
  });

  describe('listAgencyConsultantRoles()', () => {
    it('success scenario 200', async () => {
      const agencyId = 'agency id';
      const params = {
        agency_id: {
          value: agencyId
        },
        status: {
          value: 'enabled'
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      const limit = 2;
      const skip = 10;
      const sortBy = ['name'];
      const query = {sampleQuery: 'ok'};
      const data = [{sample: 'ok'}];
      const getItemsPerPage = sinon.stub(QueryHelper, 'getItemsPerPage').returns(limit);
      const getSkipValue = sinon.stub(QueryHelper, 'getSkipValue').returns(skip);
      const getSortParams = sinon.stub(QueryHelper, 'getSortParams').returns(sortBy);
      const getQuery = sinon.stub(QueryHelper, 'getQuery').returns(query);
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').resolves({
        count: 1,
        data
      });
      const setPaginationHeaders = sinon.stub(PaginationHelper, 'setPaginationHeaders').resolves();

      await listAgencyConsultantRoles(req, res, next);
      getItemsPerPage.should.have.been.calledWith(params);
      getSkipValue.should.have.been.calledWith(params);
      getSortParams.should.have.been.calledWith(params);
      getQuery.should.have.been.calledWith(params);
      listResources.should.have.been.calledWith(
        {
          ...query,
          agency_id: agencyId
        },
        limit,
        skip,
        sortBy
      );
      res.statusCode.should.equal(200);
      setPaginationHeaders.should.have.been.calledWith(req, res, 1);
      end.should.have.been.calledWith(JSON.stringify(data));
      next.should.not.have.been.called;
    });

    it('success scenario 204', async () => {
      const agencyId = 'agency id';
      const params = {
        agency_id: {
          value: agencyId
        },
        status: {
          value: 'enabled'
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      const limit = 2;
      const skip = 10;
      const sortBy = ['name'];
      const query = {sampleQuery: 'ok'};
      const data: any[] = [];
      const getItemsPerPage = sinon.stub(QueryHelper, 'getItemsPerPage').returns(limit);
      const getSkipValue = sinon.stub(QueryHelper, 'getSkipValue').returns(skip);
      const getSortParams = sinon.stub(QueryHelper, 'getSortParams').returns(sortBy);
      const getQuery = sinon.stub(QueryHelper, 'getQuery').returns(query);
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').resolves({
        count: 0,
        data
      });
      const setPaginationHeaders = sinon.stub(PaginationHelper, 'setPaginationHeaders');

      await listAgencyConsultantRoles(req, res, next);
      getItemsPerPage.should.have.been.calledWith(params);
      getSkipValue.should.have.been.calledWith(params);
      getSortParams.should.have.been.calledWith(params);
      getQuery.should.have.been.calledWith(params);
      listResources.should.have.been.calledWith(
        {
          ...query,
          agency_id: agencyId
        },
        limit,
        skip,
        sortBy
      );
      res.statusCode.should.equal(204);
      setPaginationHeaders.should.not.have.been.called;
      end.should.have.been.calledWith();
      next.should.not.have.been.called;
    });

    it('failure scenario', async () => {
      const agencyId = 'agency id';
      const params = {
        agency_id: {
          value: agencyId
        },
        status: {
          value: 'enabled'
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();

      const limit = 2;
      const skip = 10;
      const sortBy = ['name'];
      const query = {sampleQuery: 'ok'};
      const getItemsPerPage = sinon.stub(QueryHelper, 'getItemsPerPage').returns(limit);
      const getSkipValue = sinon.stub(QueryHelper, 'getSkipValue').returns(skip);
      const getSortParams = sinon.stub(QueryHelper, 'getSortParams').returns(sortBy);
      const getQuery = sinon.stub(QueryHelper, 'getQuery').returns(query);
      const error = new Error('some error');
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').rejects(error);

      await listAgencyConsultantRoles(req, res, next);
      getItemsPerPage.should.have.been.calledWith(params);
      getSkipValue.should.have.been.calledWith(params);
      getSortParams.should.have.been.calledWith(params);
      getQuery.should.have.been.calledWith(params);
      listResources.should.have.been.calledWith(
        {
          ...query,
          agency_id: agencyId
        },
        limit,
        skip,
        sortBy
      );
      next.should.have.been.calledWith(error);
    });
  });

  describe('enableAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        agency_consultant_role_payload: {
          value: {}
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(AgencyCommandBus.prototype, 'execute').resolves();
      await enableAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
    });

    it('failure scenario, ResourceNotFoundError', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: roleId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();

      const error = new ResourceNotFoundError('sample');

      sinon.stub(AgencyCommandBus.prototype, 'execute').rejects(error);

      await enableAgencyConsultantRole(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called');
    });
  });

  describe('disableAgencyConsultantRole()', () => {
    it('success scenario', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        agency_consultant_role_payload: {
          value: {}
        }
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(AgencyCommandBus.prototype, 'execute').resolves();
      await disableAgencyConsultantRole(req, res, next);
      assert.equal(res.statusCode, 202, 'status code expected to be 202');
      assert.equal(end.callCount, 1, 'Expected end to be called');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
    });

    it('failure scenario, ResourceNotFoundError', async () => {
      const agencyId = 'agency id';
      const roleId = 'AAA';
      const params = {
        agency_id: {value: agencyId},
        consultant_role_id: {value: roleId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();

      const error = new ResourceNotFoundError('sample');

      sinon.stub(AgencyCommandBus.prototype, 'execute').rejects(error);

      await disableAgencyConsultantRole(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called');
    });
  });
});
