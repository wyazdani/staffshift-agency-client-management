import sinon from 'ts-sinon';
import {AgencyClientPaymentTermsProjection} from '../../../../src/models/AgencyClientPaymentTermsProjectionV1';
import {AgencyClientEmptyPaymentTermInheritedEventHandler} from '../../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientEmptyPaymentTermInheritedEventHandler';

describe('AgencyClientEmptyPaymentTermInheritedEventHandler', () => {
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
        }
      };
      const updateOne = sinon.stub(AgencyClientPaymentTermsProjection, 'updateOne').resolves();
      const handler = new AgencyClientEmptyPaymentTermInheritedEventHandler();

      await handler.handle(event);
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            inherited: true,
            payment_term: 'not_set'
          }
        },
        {
          upsert: true
        }
      );
    });
  });
});
