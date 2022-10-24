import sinon, {stubInterface} from 'ts-sinon';
import {SetRequiresBookingPasswordCommandHandler} from '../../../../src/aggregates/BookingPreference/command-handlers';
import {BookingPreferenceAggregate} from '../../../../src/aggregates/BookingPreference/BookingPreferenceAggregate';
import {BookingPreferenceRepository} from '../../../../src/aggregates/BookingPreference/BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../../../../src/aggregates/BookingPreference/types';
import {SetRequiresBookingPasswordCommandInterface} from '../../../../src/aggregates/BookingPreference/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';
import {ValidationError} from 'a24-node-error-utils';

describe('SetRequiresBookingPasswordCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for set requires booking password', async () => {
      const command: SetRequiresBookingPasswordCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
        data: {booking_passwords: ['test']}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getCommandAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetRequiresBookingPasswordCommandHandler(repository);

      await handler.execute(command);
      repository.getCommandAggregate.should.have.been.calledOnceWith(command);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
          aggregate_id: aggregate.getId(),
          data: {booking_passwords: ['test']},
          sequence_id: 2
        }
      ]);
    });

    it('Test throw error if validateSetRequiresBookingPassword() throws an exception', async () => {
      const command: SetRequiresBookingPasswordCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
        data: {booking_passwords: ['test']}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getCommandAggregate.resolves(aggregate);
      aggregate.validateSetRequiresBookingPassword.throws(new ValidationError('sample'));
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetRequiresBookingPasswordCommandHandler(repository);

      await handler.execute(command).should.have.been.rejectedWith(ValidationError);
      repository.getCommandAggregate.should.have.been.calledOnceWith(command);
      aggregate.validateSetRequiresBookingPassword.should.have.been.calledOnce;
      repository.save.should.not.have.been.called;
    });
  });
});
