import sinon from 'sinon';
import {assert} from 'chai';
import {GenericRepository} from '../../src/GenericRepository';
import {getAgencyClient, listAgencyClients} from '../../src/controllers/AgencyClients';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {QueryHelper} from 'a24-node-query-utils';
import {PaginationHelper} from '../../src/helpers/PaginationHelper';

describe('AgencyClients', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('getAgencyClient()', function () {
    it('should return agency client record on success', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const setHeader = sinon.stub(res, 'setHeader');
      const record: any = {
        _id: clientId,
        agency_id: agencyId,
        client_id: clientId,
        linked: true
      };
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves(record);

      await getAgencyClient(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      setHeader.should.have.been.calledWith('Content-Type', 'application/json');
      end.should.have.been.calledWith(JSON.stringify(record));
    });

    it('should call next with ResourceNotFoundError when agency client record is not found', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves();

      await getAgencyClient(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      next.getCall(0).args[0].should.be.instanceOf(ResourceNotFoundError);
    });

    it('should call next with an error when findOne operation fails', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const error = new Error('some error');
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').rejects(error);

      await getAgencyClient(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      assert.deepEqual(next.getCall(0).args[0], error);
    });
  });

  describe('listAgencyClients()', function () {
    it('should return an array of agency clients on success', async () => {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {
          value: agencyId
        },
        client_type: {
          value: 'site'
        }
      };
      const req = fakeRequest({swaggerParams: params});
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const limit = 1;
      const skip = 5;
      const query = {client_type: 'site'};
      const agencyClients = [
        {
          _id: clientId,
          agency_id: agencyId,
          client_id: clientId,
          linked: true
        }
      ];
      const getItemsPerPage = sinon.stub(QueryHelper, 'getItemsPerPage').returns(limit);
      const getSkipValue = sinon.stub(QueryHelper, 'getSkipValue').returns(skip);
      const getSortParams = sinon.stub(QueryHelper, 'getSortParams').returns({});
      const getQuery = sinon.stub(QueryHelper, 'getQuery').returns(query);
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').resolves({
        count: 1,
        data: agencyClients
      });
      const setPaginationHeaders = sinon.stub(PaginationHelper, 'setPaginationHeaders').resolves();

      await listAgencyClients(req, res, next);
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
        {}
      );
      res.statusCode.should.equal(200);
      setPaginationHeaders.should.have.been.calledWith(req, res, 1);
      end.should.have.been.calledWith(JSON.stringify(agencyClients));
      next.should.not.have.been.called;
    });

    it('should set 204 status code for empty results', async () => {
      const agencyId = 'agency id';
      const params = {
        agency_id: {
          value: agencyId
        },
        client_type: {
          value: 'site'
        }
      };
      const req = fakeRequest({swaggerParams: params});
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const limit = 1;
      const skip = 5;
      const query = {client_type: 'site'};
      const getItemsPerPage = sinon.stub(QueryHelper, 'getItemsPerPage').returns(limit);
      const getSkipValue = sinon.stub(QueryHelper, 'getSkipValue').returns(skip);
      const getSortParams = sinon.stub(QueryHelper, 'getSortParams').returns({});
      const getQuery = sinon.stub(QueryHelper, 'getQuery').returns(query);
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').resolves({
        count: 0,
        data: []
      });
      const setPaginationHeaders = sinon.stub(PaginationHelper, 'setPaginationHeaders').resolves();

      await listAgencyClients(req, res, next);
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
        {}
      );
      res.statusCode.should.equal(204);
      setPaginationHeaders.should.have.been.calledWith(req, res, 0);
      end.should.have.been.called;
      next.should.not.have.been.called;
    });

    it('should call next with error thrown while retrieving agency clients', async () => {
      const agencyId = 'agency id';
      const params = {
        agency_id: {
          value: agencyId
        },
        client_type: {
          value: 'site'
        }
      };
      const req = fakeRequest({swaggerParams: params});
      const res = fakeResponse();
      const next = sinon.spy();
      const limit = 1;
      const skip = 5;
      const query = {client_type: 'site'};
      const getItemsPerPage = sinon.stub(QueryHelper, 'getItemsPerPage').returns(limit);
      const getSkipValue = sinon.stub(QueryHelper, 'getSkipValue').returns(skip);
      const getSortParams = sinon.stub(QueryHelper, 'getSortParams').returns({});
      const getQuery = sinon.stub(QueryHelper, 'getQuery').returns(query);
      const error = new Error('some error');
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').rejects(error);

      await listAgencyClients(req, res, next);
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
        {}
      );
      next.should.have.been.calledWith(error);
    });
  });
});
