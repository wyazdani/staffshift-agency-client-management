import sinon from 'sinon';
import {addAgencyClientConsultant, listAgencyClientConsultants} from '../../src/controllers/AgencyClientConsultants';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectID} from 'mongodb';
import {AgencyClientCommandEnum} from '../../src/AgencyClient/types';
import {AgencyClientCommandBus} from '../../src/AgencyClient/AgencyClientCommandBus';
import {GenericRepository} from '../../src/GenericRepository';
import {QueryHelper} from 'a24-node-query-utils';
import {PaginationHelper} from '../../src/helpers/PaginationHelper';

describe('AgencyClientConsultants', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('addAgencyClientConsultant()', () => {
    const agencyId = 'agency id';
    const clientId = 'some id';
    const id = 'id';
    const location = `/v1/localhost/path/${id}`;
    const payload = {
      _id: id,
      consultant_role_id: '6141d9cb9fb4b44d5346914a',
      consultant_id: '6141d9cb9fb4b44d53469150'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      assign_client_consultant_payload: {
        value: payload
      }
    };

    it('success scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path'
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const setHeader = sinon.stub(res, 'setHeader');
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);

      const execute = sinon.stub(AgencyClientCommandBus.prototype, 'execute').resolves();

      await addAgencyClientConsultant(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['Location', location], 'Incorrect location header set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          clientId,
          {
            type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
            data: payload
          }
        ],
        'AgencyClientCommandBus.execute called with incorrect arguments'
      );
    });

    it('failure scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path'
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const error = new Error('custom');
      const execute = sinon.stub(AgencyClientCommandBus.prototype, 'execute').rejects(error);

      await addAgencyClientConsultant(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      assert.deepEqual(
        execute.getCall(0).args,
        [
          agencyId,
          clientId,
          {
            type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
            data: payload
          }
        ],
        'AgencyClientCommandBus.execute expected parameters failed'
      );
    });
  });

  describe('listAgencyClientConsultants()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const agencyClientConsultantId = 'client consultant id';
    const consultantRoleId = 'consultant role id';
    const consultantId = 'consultant id';
    const params = {
      agency_id: {value: agencyId},
      client_id: {value: clientId}
    };

    it('success scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const records: any = [
        {
          _id: agencyClientConsultantId,
          agency_id: agencyId,
          consultant_role_id: consultantRoleId,
          consultant_role_name: 'some name',
          consultant_id: consultantId,
          last_sequence_id: 1,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];
      const listResponse = {
        count: 1,
        data: records
      };
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').resolves(listResponse);

      sinon.stub(QueryHelper, 'getItemsPerPage').returns(25);
      sinon.stub(QueryHelper, 'getSkipValue').returns(0);
      sinon.stub(QueryHelper, 'getSortParams').returns({});
      sinon.stub(QueryHelper, 'getQuery').returns({});
      sinon.stub(PaginationHelper, 'setPaginationHeaders').resolves();

      await listAgencyClientConsultants(req, res, next);
      listResources.should.have.been.calledWith(
        {
          client_id: clientId,
          agency_id: agencyId
        },
        25,
        0,
        {}
      );
      end.should.have.been.calledWith(JSON.stringify(records));
    });

    it('empty scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const records: any = [];
      const listResponse = {
        count: 1,
        data: records
      };
      const listResources = sinon.stub(GenericRepository.prototype, 'listResources').resolves(listResponse);

      sinon.stub(QueryHelper, 'getItemsPerPage').returns(25);
      sinon.stub(QueryHelper, 'getSkipValue').returns(0);
      sinon.stub(QueryHelper, 'getSortParams').returns({});
      sinon.stub(QueryHelper, 'getQuery').returns({});
      sinon.stub(PaginationHelper, 'setPaginationHeaders').resolves();

      await listAgencyClientConsultants(req, res, next);
      listResources.should.have.been.calledWith(
        {
          client_id: clientId,
          agency_id: agencyId
        },
        25,
        0,
        {}
      );
      end.should.have.been.calledWith();
    });
  });
});
