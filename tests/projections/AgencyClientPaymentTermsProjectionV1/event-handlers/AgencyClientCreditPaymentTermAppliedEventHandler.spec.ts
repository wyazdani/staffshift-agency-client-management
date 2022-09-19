import sinon from 'ts-sinon';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../../src/models/AgencyClientPaymentTermsProjectionV1';
import {AgencyClientCreditPaymentTermAppliedEventHandler} from '../../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientCreditPaymentTermAppliedEventHandler';

describe('AgencyClientCreditPaymentTermAppliedEventHandler', () => {
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
      const handler = new AgencyClientCreditPaymentTermAppliedEventHandler();

      await handler.handle(event);
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            payment_term: PAYMENT_TERM_PROJECTION_ENUM.CREDIT,
            inherited: false,
            _etags: {
              [event.aggregate_id.name]: event.sequence_id,
              organisation_job: event.causation_id
            }
          }
        },
        {
          upsert: true
        }
      );
    });
  });
});
