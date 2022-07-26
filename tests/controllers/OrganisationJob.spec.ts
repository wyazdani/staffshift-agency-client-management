import {ResourceNotFoundError} from 'a24-node-error-utils';
import sinon from 'sinon';
import {ConsultantJobCommandEnum} from '../../src/aggregates/ConsultantJob/types';
import {initiateApplyPaymentTerm, getPaymentTerm} from '../../src/controllers/OrganisationJob';
import {GenericRepository} from '../../src/GenericRepository';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectID} from 'mongodb';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';
import {OrganisationJobCommandEnum} from '../../src/aggregates/OrganisationJob/types';

describe('OrganisationJob Controller', () => {
  const commandBus = new CommandBus(new EventRepository(EventStore, 'test-cases'));

  describe('initiateApplyPaymentTerm()', () => {
    const agencyId = '5b1a7a31e8a73a73374d3fa2';
    const clientId = '5f117112e8a73a3277745572';
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
      assign_consultant_payload: {
        value: payload
      }
    };

    // it.only('success scenario', async () => {
    //   const req = fakeRequest({
    //     swaggerParams: params,
    //     basePathName: '/v1/localhost/path',
    //     commandBus
    //   });
    //   const res = fakeResponse();
    //   const next = sinon.spy();
    //   const end = sinon.stub(res, 'end');

    //   sinon.stub(ObjectID.prototype, 'toString').returns(id);

    //   const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

    //   await initiateApplyPaymentTerm(req, res, next);
    //   assert.equal(res.statusCode, 202, 'incorrect status code returned');
    //   assert.equal(end.callCount, 1, 'Expected end to be called once');
    //   assert.equal(next.callCount, 0, 'Expected next to not be called');
    //   execute.should.have.been.calledOnceWith({
    //     aggregateId: {
    //       name: 'organisation_job',
    //       agency_id: agencyId,
    //       organisation_id: organisationId
    //     },
    //     type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
    //     data: {
    //       _id: id,
    //       client_id:clientId,
    //       ...payload
    //     }
    //   });
    // });
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
});
