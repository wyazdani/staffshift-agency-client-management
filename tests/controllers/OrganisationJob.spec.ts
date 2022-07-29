import sinon from 'sinon';
import {ConsultantJobCommandEnum} from '../../src/aggregates/ConsultantJob/types';
import {initiateApplyPaymentTerm, initiateInheritApplyPaymentTerm} from '../../src/controllers/OrganisationJob';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectID} from 'mongodb';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';
import {OrganisationJobCommandEnum} from '../../src/aggregates/OrganisationJob/types';
import {GenericRepository} from '../../src/GenericRepository';
import {ValidationError} from 'a24-node-error-utils';

describe('OrganisationJob Controller', () => {
  const commandBus = new CommandBus(new EventRepository(EventStore, 'test-cases'));

  describe('initiateApplyPaymentTerm()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const organisationId = 'organisation id';
    const id = 'id';
    const payload = {
      term: 'credit'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      initiate_apply_payment_term_payload: {
        value: payload
      }
    };

    it('success scenario client type other than organisation', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 'site',
        linked: true
      };
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await initiateApplyPaymentTerm(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
        data: {
          _id: id,
          client_id: clientId,
          ...payload
        }
      });
    });

    it('success scenario client type organisation', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: '',
        site_id: 'some site',
        client_type: 'organisation',
        linked: true
      };
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await initiateApplyPaymentTerm(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: clientId
        },
        type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
        data: {
          _id: id,
          client_id: clientId,
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
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 1,
        linked: true
      };
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await initiateApplyPaymentTerm(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
        data: {
          _id: id,
          client_id: clientId,
          ...payload
        }
      });
    });
  });

  describe('initiateInheritApplyPaymentTerm()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const organisationId = 'organisation id';
    const id = 'id';
    const payload = {
      term: 'credit'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
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

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 1,
        linked: true
      };
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await initiateInheritApplyPaymentTerm(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_INHERIT_PAYMENT_TERM,
        data: {
          _id: id,
          client_id: clientId
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
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 1,
        linked: true
      };
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await initiateInheritApplyPaymentTerm(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_INHERIT_PAYMENT_TERM,
        data: {
          _id: id,
          client_id: clientId
        }
      });
    });

    it('failure scenario on organisation', async () => {
      const req = fakeRequest({
        swaggerParams: params,
        basePathName: '/v1/localhost/path',
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectID.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 'organisation',
        linked: true
      };
      const error = new ValidationError('Cannot be inherited on organisation');
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);

      sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await initiateInheritApplyPaymentTerm(req, res, next);
      assert.equal(end.callCount, 0, 'Expected end to be not called');
      assert.equal(next.callCount, 1, 'Expected next to be called');
      agencyClient.should.have.been.calledOnceWith();
    });
  });
});
