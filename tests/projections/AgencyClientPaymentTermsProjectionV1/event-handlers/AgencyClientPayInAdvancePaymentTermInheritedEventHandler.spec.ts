import sinon from 'ts-sinon';
import {EventsEnum} from '../../../../src/Events';
import {EventStoreCacheHelper} from '../../../../src/helpers/EventStoreCacheHelper';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../../src/models/AgencyClientPaymentTermsProjectionV1';
import {EventStore} from '../../../../src/models/EventStore';
import {AgencyClientPayInAdvancePaymentTermInheritedEventHandler} from '../../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientPayInAdvancePaymentTermInheritedEventHandler';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('AgencyClientPayInAdvancePaymentTermInheritedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('handle()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const logger = TestUtilsLogger.getLogger(sinon.spy());

    it('Test success scenario', async () => {
      const event: any = {
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId,
          name: 'payment_term'
        },
        causation_id: 'test',
        sequence_id: 1
      };
      const eventStore = new EventStore({
        type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
        aggregate_id: {},
        data: {},
        sequence_id: 1,
        meta_data: {
          user_id: 'test'
        },
        correlation_id: '123'
      });
      const eventStoreCacheHelper = new EventStoreCacheHelper('1m', 10);
      const findEventById = sinon.stub(eventStoreCacheHelper, 'findEventById').resolves(eventStore);
      const updateOne = sinon.stub(AgencyClientPaymentTermsProjection, 'updateOne').resolves();
      const handler = new AgencyClientPayInAdvancePaymentTermInheritedEventHandler(logger, eventStoreCacheHelper);

      await handler.handle(event);
      findEventById.should.have.been.calledOnceWith(event.causation_id, logger);
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            payment_term: PAYMENT_TERM_PROJECTION_ENUM.PAY_IN_ADVANCE,
            inherited: true,
            _etags: {
              [event.aggregate_id.name]: event.sequence_id,
              organisation_job: eventStore.sequence_id
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
