import sinon from 'ts-sinon';
import {AgencyClientBookingPreferencesProjection} from '../../../../src/models/AgencyClientBookingPreferencesProjectionV1';
import {AgencyClientRequiresPONumberUnsetEventHandler} from '../../../../src/projections/AgencyClientBookingPreferencesProjectionV1/event-handlers';

describe('AgencyClientRequiresPONumberUnsetEventHandler', () => {
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
          client_id: clientId
        },
        data: {}
      };
      const updateOne = sinon.stub(AgencyClientBookingPreferencesProjection, 'updateOne').resolves();
      const handler = new AgencyClientRequiresPONumberUnsetEventHandler();

      await handler.handle(event);
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            requires_po_number: false
          }
        },
        {
          upsert: true
        }
      );
    });
  });
});
