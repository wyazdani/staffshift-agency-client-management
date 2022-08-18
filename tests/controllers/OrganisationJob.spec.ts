import sinon from 'sinon';
import {
  initiateApplyPaymentTerm,
  initiateInheritApplyPaymentTerm,
  getPaymentTerm,
  getFinancialHold,
  applyFinancialHold,
  clearFinancialHold,
  inheritFinancialHold
} from '../../src/controllers/OrganisationJob';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectId} from 'mongodb';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';
import {OrganisationJobCommandEnum} from '../../src/aggregates/OrganisationJob/types';
import {GenericRepository} from '../../src/GenericRepository';
import {ValidationError, ResourceNotFoundError} from 'a24-node-error-utils';

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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 'organisation',
        linked: true
      };
      const error = new ValidationError('Operation not possible due to inheritance problem').setErrors([
        {
          code: 'INVALID_CLIENT_TYPE',
          message: 'Cannot be inherited on organisation client type'
        }
      ]);
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);

      sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await initiateInheritApplyPaymentTerm(req, res, next);
      assert.equal(end.callCount, 0, 'Expected end to be not called');
      assert.equal(next.callCount, 1, 'Expected next to be called');
      error.assertEqual(
        new ValidationError('Operation not possible due to inheritance problem').setErrors([
          {
            code: 'INVALID_CLIENT_TYPE',
            message: 'Cannot be inherited on organisation client type'
          }
        ])
      );
      agencyClient.should.have.been.calledOnceWith();
    });
  });

  describe('getPaymentTerm()', function () {
    it('should return record on success', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params,
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const setHeader = sinon.stub(res, 'setHeader');
      const record: any = {
        _id: clientId,
        agency_id: agencyId,
        client_id: clientId,
        inherited: true
      };
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves(record);

      await getPaymentTerm(req, res, next);
      findOne.should.have.been.calledWith({
        agency_id: agencyId,
        client_id: clientId
      });
      setHeader.should.have.been.calledWith('Content-Type', 'application/json');
      end.should.have.been.calledWith(JSON.stringify(record));
    });

    it('should ResourceNotFoundError', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params,
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves();

      await getPaymentTerm(req, res, next);
      findOne.should.have.been.calledWith({
        agency_id: agencyId,
        client_id: clientId
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
        swaggerParams: params,
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const error = new Error('some error');
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').rejects(error);

      await getPaymentTerm(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      assert.deepEqual(next.getCall(0).args[0], error);
    });
  });

  describe('getFinancialHold()', function () {
    it('should return record on success', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params,
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');
      const setHeader = sinon.stub(res, 'setHeader');
      const record: any = {
        _id: clientId,
        agency_id: agencyId,
        client_id: clientId,
        inherited: true
      };
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves(record);

      await getFinancialHold(req, res, next);
      findOne.should.have.been.calledWith({
        agency_id: agencyId,
        client_id: clientId
      });
      setHeader.should.have.been.calledWith('Content-Type', 'application/json');
      end.should.have.been.calledWith(JSON.stringify(record));
    });

    it('should ResourceNotFoundError', async function () {
      const agencyId = 'agency id';
      const clientId = '61a63e6eb34a527a852d6874';
      const params = {
        agency_id: {value: agencyId},
        client_id: {value: clientId}
      };
      const req = fakeRequest({
        swaggerParams: params,
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves();

      await getFinancialHold(req, res, next);
      findOne.should.have.been.calledWith({
        agency_id: agencyId,
        client_id: clientId
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
        swaggerParams: params,
        commandBus
      });
      const res = fakeResponse();
      const next = sinon.spy();
      const error = new Error('some error');
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').rejects(error);

      await getFinancialHold(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      assert.deepEqual(next.getCall(0).args[0], error);
    });
  });

  describe('applyFinancialHold()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const organisationId = 'organisation id';
    const id = 'id';
    const payload = {
      note: 'test'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      initiate_financial_hold_payload: {
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await applyFinancialHold(req, res, next);
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
        type: OrganisationJobCommandEnum.INITIATE_APPLY_FINANCIAL_HOLD,
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await applyFinancialHold(req, res, next);
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
        type: OrganisationJobCommandEnum.INITIATE_APPLY_FINANCIAL_HOLD,
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await applyFinancialHold(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_APPLY_FINANCIAL_HOLD,
        data: {
          _id: id,
          client_id: clientId,
          ...payload
        }
      });
    });
  });

  describe('clearFinancialHold()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const organisationId = 'organisation id';
    const id = 'id';
    const payload = {
      note: 'test'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      initiate_financial_hold_payload: {
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await clearFinancialHold(req, res, next);
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
        type: OrganisationJobCommandEnum.INITIATE_CLEAR_FINANCIAL_HOLD,
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await clearFinancialHold(req, res, next);
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
        type: OrganisationJobCommandEnum.INITIATE_CLEAR_FINANCIAL_HOLD,
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await clearFinancialHold(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_CLEAR_FINANCIAL_HOLD,
        data: {
          _id: id,
          client_id: clientId,
          ...payload
        }
      });
    });
  });

  describe('inheritFinancialHold()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const organisationId = 'organisation id';
    const id = 'id';
    const payload = {
      note: 'test'
    };
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      initiate_financial_hold_payload: {
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

      await inheritFinancialHold(req, res, next);
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
        type: OrganisationJobCommandEnum.INITIATE_INHERIT_FINANCIAL_HOLD,
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
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

      await inheritFinancialHold(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      agencyClient.should.have.been.calledOnceWith();
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'organisation_job',
          agency_id: agencyId,
          organisation_id: organisationId
        },
        type: OrganisationJobCommandEnum.INITIATE_INHERIT_FINANCIAL_HOLD,
        data: {
          _id: id,
          client_id: clientId,
          ...payload
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

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const listResponse = {
        _id: '3123123',
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: organisationId,
        site_id: 'some site',
        client_type: 'organisation',
        linked: true
      };
      const error = new ValidationError('Operation not possible due to inheritance problem').setErrors([
        {
          code: 'INVALID_CLIENT_TYPE',
          message: 'Cannot be inherited on organisation client type'
        }
      ]);
      const agencyClient = sinon.stub(GenericRepository.prototype, 'findOne').resolves(listResponse);

      sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await inheritFinancialHold(req, res, next);
      assert.equal(end.callCount, 0, 'Expected end to be not called');
      assert.equal(next.callCount, 1, 'Expected next to be called');
      error.assertEqual(
        new ValidationError('Operation not possible due to inheritance problem').setErrors([
          {
            code: 'INVALID_CLIENT_TYPE',
            message: 'Cannot be inherited on organisation client type'
          }
        ])
      );
      agencyClient.should.have.been.calledOnceWith();
    });
  });
});
