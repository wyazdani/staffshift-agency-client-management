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
  unsetRequiresShiftRefNumber,
  getBookingPreference
} from '../../src/controllers/BookingPreference';
import {fakeRequest, fakeResponse} from '../tools/TestUtilsHttp';
import {assert} from 'chai';
import {ObjectId} from 'mongodb';
import {CommandBus} from '../../src/aggregates/CommandBus';
import {EventRepository} from '../../src/EventRepository';
import {EventStore} from '../../src/models/EventStore';
import {BookingPreferenceCommandEnum} from '../../src/aggregates/BookingPreference/types';
import {GenericRepository} from '../../src/GenericRepository';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {TestUtilsLogger} from '../tools/TestUtilsLogger';

describe('BookingPreference Controller', () => {
  const commandBus = new CommandBus(
    new EventRepository(EventStore, 'test-cases'),
    TestUtilsLogger.getLogger(sinon.spy())
  );

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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await setRequiresPONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await unsetRequiresPONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await setRequiresShiftRefNumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await setRequiresUniquePONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await unsetRequiresUniquePONumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await setRequiresBookingPassword(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await unsetRequiresBookingPassword(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await updateBookingPassword(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
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
      const setHeader = sinon.stub(res, 'setHeader');
      const next = sinon.spy();
      const end = sinon.stub(res, 'end');

      sinon.stub(ObjectId.prototype, 'toString').returns(id);
      const execute = sinon.stub(CommandBus.prototype, 'execute').resolves(1);

      await unsetRequiresShiftRefNumber(req, res, next);
      assert.equal(res.statusCode, 202, 'incorrect status code returned');
      assert.deepEqual(setHeader.getCall(0).args, ['ETag', 'W/"booking_preference:1"'], 'Expected header to be set');
      assert.equal(end.callCount, 1, 'Expected end to be called once');
      assert.equal(next.callCount, 0, 'Expected next to not be called');
      execute.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER,
        data: {},
        optimistic_lock: undefined
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
        data: {},
        optimistic_lock: undefined
      });
    });
  });

  describe('getBookingPreference()', function () {
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
        requires_po_number: true,
        requires_unique_po_number: true,
        requires_booking_password: true,
        requires_shift_ref_number: true,
        booking_passwords: ['test', 'test2']
      };
      const findOne = sinon.stub(GenericRepository.prototype, 'findOne').resolves(record);

      await getBookingPreference(req, res, next);
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

      await getBookingPreference(req, res, next);
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

      await getBookingPreference(req, res, next);
      findOne.should.have.been.calledWith({
        client_id: clientId,
        agency_id: agencyId
      });
      assert.deepEqual(next.getCall(0).args[0], error);
    });
  });
});
