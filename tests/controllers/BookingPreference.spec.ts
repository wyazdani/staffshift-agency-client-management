import sinon from 'sinon';
import {
  setRequiresBookingPassword,
  setRequiresPONumber,
  setRequiresUniquePONumber,
  unsetRequiresBookingPassword,
  unsetRequiresPONumber,
  unsetRequiresUniquePONumber,
  updateBookingPassword,
  setRequiresShiftRefNumber,
  unsetRequiresShiftRefNumber
} from '../../src/controllers/BookingPreference';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectId} from 'mongodb';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';
import {BookingPreferenceCommandEnum} from '../../src/aggregates/BookingPreference/types';

describe('BookingPreference Controller', () => {
  const commandBus = new CommandBus(new EventRepository(EventStore, 'test-cases'));

  describe('setRequiresPONumber()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await setRequiresPONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await setRequiresPONumber(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
        data: {}
      });
    });
  });

  describe('unsetRequiresPONumber()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await unsetRequiresPONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await unsetRequiresPONumber(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
        data: {}
      });
    });
  });

  describe('setRequiresShiftRefNumber()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await setRequiresShiftRefNumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await setRequiresShiftRefNumber(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER,
        data: {}
      });
    });
  });

  describe('setRequiresUniquePONumber()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await setRequiresUniquePONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await setRequiresUniquePONumber(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {}
      });
    });
  });

  describe('unsetRequiresUniquePONumber()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await unsetRequiresUniquePONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await unsetRequiresUniquePONumber(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {}
      });
    });
  });

  describe('setRequiresBookingPassword()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      set_booking_password_payload: {
        booking_passwords: ['1', '2']
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

      await setRequiresBookingPassword(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await setRequiresBookingPassword(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
        data: {}
      });
    });
  });

  describe('unsetRequiresBookingPassword()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await unsetRequiresBookingPassword(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await unsetRequiresBookingPassword(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD,
        data: {}
      });
    });
  });

  describe('updateBookingPassword()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
    const params = {
      agency_id: {
        value: agencyId
      },
      client_id: {
        value: clientId
      },
      update_booking_password_payload: {
        booking_passwords: ['1', '2']
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

      await updateBookingPassword(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await updateBookingPassword(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
        data: {}
      });
    });
  });

  describe('unsetRequiresShiftRefNumber()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const id = 'id';
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
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves();

      await unsetRequiresShiftRefNumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER,
        data: {}
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
      const error = new Error('custom');
      const execute = sinon.stub(CommandBus.prototype, 'execute').rejects(error);

      await unsetRequiresShiftRefNumber(req, res, next);
      assert.equal(next.callCount, 1, 'Expected next to be called once');
      assert.equal(next.getCall(0).args[0], error, 'Returned error does not match expected');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER,
        data: {}
      });
    });
  });
});
