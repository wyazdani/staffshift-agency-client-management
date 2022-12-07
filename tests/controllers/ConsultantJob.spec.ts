import sinon from 'sinon';
import {ConsultantJobCommandEnum} from '../../src/aggregates/ConsultantJob/types';
import {assignConsultant, unassignConsultant, transferConsultant} from '../../src/controllers/ConsultantJob';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectId} from 'mongodb';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('ConsultantJob Controller', () => {
  const commandBus = new CommandBus(
    new EventRepository(EventStore, 'test-cases'),
    TestUtilsLogger.getLogger(sinon.spy())
  );

  describe('assignConsultant()', () => {
    const agencyId = 'agency id';
    const clientId = 'some id';
    const id = 'id';
    const payload = {
      consultant_role_id: '6141d9cb9fb4b44d5346914a',
      consultant_id: '6141d9cb9fb4b44d53469150',
      client_ids: ['client id 1']
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      assign_consultant_payload: {
        value: payload
      }
    };

    it('success scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);

      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await assignConsultant(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'consultant_job',
          agency_id: agencyId
        },
        type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
        data: {
          _id: id,
          ...payload
        }
      });
    });

    it('failure scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await assignConsultant(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'consultant_job',
          agency_id: agencyId
        },
        type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
        data: {
          _id: id,
          ...payload
        }
      });
    });
  });

  describe('unassignConsultant()', () => {
    const agencyId = 'agency id';
    const clientId = 'some id';
    const id = 'id';
    const payload = {
      consultant_role_id: '6141d9cb9fb4b44d5346914a',
      consultant_id: '6141d9cb9fb4b44d53469150',
      client_ids: ['client id 1']
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      unassign_consultant_payload: {
        value: payload
      }
    };

    it('success scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);

      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await unassignConsultant(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'consultant_job',
          agency_id: agencyId
        },
        type: ConsultantJobCommandEnum.UNASSIGN_CONSULTANT,
        data: {
          _id: id,
          ...payload
        }
      });
    });

    it('failure scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await unassignConsultant(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'consultant_job',
          agency_id: agencyId
        },
        type: ConsultantJobCommandEnum.UNASSIGN_CONSULTANT,
        data: {
          _id: id,
          ...payload
        }
      });
    });
  });

  describe('transferConsultant()', () => {
    const agencyId = 'agency id';
    const clientId = 'some id';
    const id = 'id';
    const payload = {
      consultant_role_id: '6141d9cb9fb4b44d5346914a',
      from_consultant_id: '6141d9cb9fb4b44d53469150',
      to_consultant_id: '6141d9cb9fb4b44d53469151',
      client_ids: ['client id 1']
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      transfer_consultant_payload: {
        value: payload
      }
    };

    it('success scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);

      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await transferConsultant(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'consultant_job',
          agency_id: agencyId
        },
        type: ConsultantJobCommandEnum.TRANSFER_CONSULTANT,
        data: {
          _id: id,
          ...payload
        }
      });
    });

    it('failure scenario', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await transferConsultant(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'consultant_job',
          agency_id: agencyId
        },
        type: ConsultantJobCommandEnum.TRANSFER_CONSULTANT,
        data: {
          _id: id,
          ...payload
        }
      });
    });
  });
});
