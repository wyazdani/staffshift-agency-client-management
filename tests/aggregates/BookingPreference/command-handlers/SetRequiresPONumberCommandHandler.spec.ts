import sinon, {stubInterface} from 'ts-sinon';
import {SetRequiresPONumberCommandHandler} from '../../../../src/aggregates/BookingPreference/command-handlers';
import {BookingPreferenceAggregate} from '../../../../src/aggregates/BookingPreference/BookingPreferenceAggregate';
import {BookingPreferenceRepository} from '../../../../src/aggregates/BookingPreference/BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../../../../src/aggregates/BookingPreference/types';
import {SetRequiresPONumberCommandInterface} from '../../../../src/aggregates/BookingPreference/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('SetRequiresPONumberCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for set requires po number', async () => {
      const command: SetRequiresPONumberCommandInterface = {
        aggregateId: {
          name: 'booking_preference',
          agency_id: agencyId,
          client_id: clientId
        },
        type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
        data: {}
      };
      const repository = stubInterface<BookingPreferenceRepository>();
      const aggregate = stubInterface<BookingPreferenceAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetRequiresPONumberCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET,
          aggregate_id: aggregate.getId(),
          data: {requires_po_number: true},
          sequence_id: 2
        }
      ]);
    });
  });
});
