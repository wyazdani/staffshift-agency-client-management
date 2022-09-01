import sinon, {stubInterface} from 'ts-sinon';
import {UnsetRequiresPONumberCommandHandler} from '../../../../src/aggregates/BookingPreference/command-handlers';
import {BookingPreferenceAggregate} from '../../../../src/aggregates/BookingPreference/BookingPreferenceAggregate';
import {BookingPreferenceRepository} from '../../../../src/aggregates/BookingPreference/BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../../../../src/aggregates/BookingPreference/types';
import {UnsetRequiresPONumberCommandInterface} from '../../../../src/aggregates/BookingPreference/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';
import {ValidationError} from 'a24-node-error-utils';

describe('UnsetRequiresPONumberCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for unset requires po number', async () => {
      const command: UnsetRequiresPONumberCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
        data: {}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new UnsetRequiresPONumberCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test throw error if validateSetRequiresPONumber() throws an exception', async () => {
      const command: UnsetRequiresPONumberCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER,
        data: {}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateUnsetRequiresPONumber.throws(new ValidationError('sample'));
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new UnsetRequiresPONumberCommandHandler(repository);

      await handler.execute(command).should.have.been.rejectedWith(ValidationError);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateUnsetRequiresPONumber.should.have.been.calledOnce;
      repository.save.should.not.have.been.called;
    });
  });
});
