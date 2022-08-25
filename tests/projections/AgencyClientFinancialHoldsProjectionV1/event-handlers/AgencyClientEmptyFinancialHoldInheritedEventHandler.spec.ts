import sinon from 'ts-sinon';
import {
  AgencyClientFinancialHoldsProjection,
  FINANCIAL_HOLD_PROJECTION_ENUM
} from '../../../../src/models/AgencyClientFinancialHoldsProjectionV1';
import {AgencyClientEmptyFinancialHoldInheritedEventHandler} from '../../../../src/projections/AgencyClientFinancialHoldsProjectionV1/event-handlers';

describe('AgencyClientEmptyFinancialHoldInheritedEventHandler', () => {
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
        data: {
          note: 'sample'
        }
      };
      const updateOne = sinon.stub(AgencyClientFinancialHoldsProjection, 'updateOne').resolves();
      const handler = new AgencyClientEmptyFinancialHoldInheritedEventHandler();

      await handler.handle(event);
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            inherited: true,
            financial_hold: FINANCIAL_HOLD_PROJECTION_ENUM.NOT_SET,
            note: 'sample'
          }
        },
        {
          upsert: true
        }
      );
    });
  });
});
