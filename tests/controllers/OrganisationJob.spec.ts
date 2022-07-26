import sinon from 'sinon';
import {ConsultantJobCommandEnum} from '../../src/aggregates/ConsultantJob/types';
import {initiateApplyPaymentTerm} from '../../src/controllers/OrganisationJob';
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
});
