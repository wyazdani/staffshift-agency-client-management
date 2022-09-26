import sinon from 'ts-sinon';
import {EventsEnum} from '../../../../src/Events';
import {EventStoreCacheHelper} from '../../../../src/helpers/EventStoreCacheHelper';
import {
  AgencyClientPaymentTermsProjection,
  PAYMENT_TERM_PROJECTION_ENUM
} from '../../../../src/models/AgencyClientPaymentTermsProjectionV1';
import {EventStore} from '../../../../src/models/EventStore';
import {AgencyClientEmptyPaymentTermInheritedEventHandler} from '../../../../src/projections/AgencyClientPaymentTermsProjectionV1/event-handlers/AgencyClientEmptyPaymentTermInheritedEventHandler';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

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
      const eventStoreCacheHelper = sinon.stub(EventStoreCacheHelper.prototype, 'findEventById').resolves(eventStore);
      const updateOne = sinon.stub(AgencyClientPaymentTermsProjection, 'updateOne').resolves();
      const handler = new AgencyClientEmptyPaymentTermInheritedEventHandler(
        TestUtilsLogger.getLogger(sinon.spy()),
        new EventStoreCacheHelper('1m')
      );

      await handler.handle(event);
      eventStoreCacheHelper.should.have.been.calledOnceWith();
      updateOne.should.have.been.calledOnceWith(
        {
          agency_id: event.aggregate_id.agency_id,
          client_id: event.aggregate_id.client_id
        },
        {
          $set: {
            inherited: true,
            payment_term: PAYMENT_TERM_PROJECTION_ENUM.NOT_SET,
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
