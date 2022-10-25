import sinon from 'ts-sinon';
import {AgencyClientBookingPreferencesProjection} from '../../../../src/models/AgencyClientBookingPreferencesProjectionV1';
import {AgencyClientRequiresPONumberSetEventHandler} from '../../../../src/projections/AgencyClientBookingPreferencesProjectionV1/event-handlers';

describe('AgencyClientRequiresPONumberSetEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('handle()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    it('Test success scenario', async () => {
      const event: any = {
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId,
          name: 'booking_preference'
        },
        data: {},
        sequence_id: 1
      };
      const updateOne = sinon.stub(AgencyClientBookingPreferencesProjection, 'updateOne').resolves();
      const handler = new AgencyClientRequiresPONumberSetEventHandler();

      await handler.handle(event);
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            requires_po_number: true,
            _etags: {[event.aggregate_id.name]: event.sequence_id}
          }
        },
        {
          upsert: true
        }
      );
    });
  });
});
