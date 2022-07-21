import sinon from 'sinon';
import {AbstractRepository} from '../../../src/aggregates/AbstractRepository';
import {PaymentTermRepository} from '../../../src/aggregates/PaymentTerm/PaymentTermRepository';
import {EventRepository, EventPointInTimeType} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {PaymentTermWriteProjectionHandler} from '../../../src/aggregates/PaymentTerm/PaymentTermWriteProjectionHandler';
import {PaymentTermAggregateIdInterface} from '../../../src/aggregates/PaymentTerm/types';

describe('PaymentTermRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const clientId = 'client id';
  const aggregateId: PaymentTermAggregateIdInterface = {
    name: 'payment_term',
    agency_id: agencyId,
    client_id: clientId
  };

  it('Test extending from AbstractRepository', () => {
    const eventRepository = new EventRepository(EventStore, 'some-id');
    const writeProjectionHandler = new PaymentTermWriteProjectionHandler();
    const paymentTermRepository = new PaymentTermRepository(eventRepository, writeProjectionHandler);

    paymentTermRepository.should.be.instanceof(AbstractRepository);
  });
  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const pointInTime: EventPointInTimeType = {sequence_id: 100};
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new PaymentTermWriteProjectionHandler();
      const paymentTermRepository = new PaymentTermRepository(eventRepository, writeProjectionHandler);

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await paymentTermRepository.getAggregate(aggregateId, pointInTime);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        pointInTime
      );
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });
});
