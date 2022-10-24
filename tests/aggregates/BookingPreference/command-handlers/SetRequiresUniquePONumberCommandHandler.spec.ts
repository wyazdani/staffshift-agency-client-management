import sinon, {stubInterface} from 'ts-sinon';
import {SetRequiresUniquePONumberCommandHandler} from '../../../../src/aggregates/BookingPreference/command-handlers';
import {BookingPreferenceAggregate} from '../../../../src/aggregates/BookingPreference/BookingPreferenceAggregate';
import {BookingPreferenceRepository} from '../../../../src/aggregates/BookingPreference/BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../../../../src/aggregates/BookingPreference/types';
import {SetRequiresUniquePONumberCommandInterface} from '../../../../src/aggregates/BookingPreference/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';
import {ValidationError} from 'a24-node-error-utils';

describe('SetRequiresUniquePONumberCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for set requires unique po number', async () => {
      const command: SetRequiresUniquePONumberCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getCommandAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetRequiresUniquePONumberCommandHandler(repository);

      await handler.execute(command);
      repository.getCommandAggregate.should.have.been.calledOnceWith(command);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test throw error if validateSetRequiresUniquePONumber() throws an exception', async () => {
      const command: SetRequiresUniquePONumberCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
        data: {}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getCommandAggregate.resolves(aggregate);
      aggregate.validateSetRequiresUniquePONumber.throws(new ValidationError('sample'));
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetRequiresUniquePONumberCommandHandler(repository);

      await handler.execute(command).should.have.been.rejectedWith(ValidationError);
      repository.getCommandAggregate.should.have.been.calledOnceWith(command);
      aggregate.validateSetRequiresUniquePONumber.should.have.been.calledOnce;
      repository.save.should.not.have.been.called;
    });
  });
});
