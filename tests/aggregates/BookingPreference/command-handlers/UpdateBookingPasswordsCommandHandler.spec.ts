import sinon, {stubInterface} from 'ts-sinon';
import {UpdateBookingPasswordsCommandHandler} from '../../../../src/aggregates/BookingPreference/command-handlers';
import {BookingPreferenceAggregate} from '../../../../src/aggregates/BookingPreference/BookingPreferenceAggregate';
import {BookingPreferenceRepository} from '../../../../src/aggregates/BookingPreference/BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../../../../src/aggregates/BookingPreference/types';
import {UpdateBookingPasswordsCommandInterface} from '../../../../src/aggregates/BookingPreference/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';
import {ValidationError} from 'a24-node-error-utils';

describe('UpdateBookingPasswordsCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for update booking password', async () => {
      const command: UpdateBookingPasswordsCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
        data: {booking_passwords: ['test']}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getCommandAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new UpdateBookingPasswordsCommandHandler(repository);

      await handler.execute(command);
      repository.getCommandAggregate.should.have.been.calledOnceWith(command);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED,
          aggregate_id: aggregate.getId(),
          data: {booking_passwords: ['test']},
          sequence_id: 2
        }
      ]);
    });

    it('Test throw error if validateUpdateBookingPasswords() throws an exception', async () => {
      const command: UpdateBookingPasswordsCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS,
        data: {booking_passwords: ['test']}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getCommandAggregate.resolves(aggregate);
      aggregate.validateUpdateBookingPasswords.throws(new ValidationError('sample'));
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new UpdateBookingPasswordsCommandHandler(repository);

      await handler.execute(command).should.have.been.rejectedWith(ValidationError);
      repository.getCommandAggregate.should.have.been.calledOnceWith(command);
      aggregate.validateUpdateBookingPasswords.should.have.been.calledOnce;
      repository.save.should.not.have.been.called;
    });
  });
});
