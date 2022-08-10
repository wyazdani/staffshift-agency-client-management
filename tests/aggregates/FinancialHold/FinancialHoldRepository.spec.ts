import sinon from 'sinon';
import {AbstractRepository} from '../../../src/aggregates/AbstractRepository';
import {FinancialHoldRepository} from '../../../src/aggregates/FinancialHold/FinancialHoldRepository';
import {EventRepository, EventPointInTimeType} from '../../../src/EventRepository';
import {EventStore} from '../../../src/models/EventStore';
import {FinancialHoldWriteProjectionHandler} from '../../../src/aggregates/FinancialHold/FinancialHoldWriteProjectionHandler';
import {FinancialHoldAggregateIdInterface} from '../../../src/aggregates/FinancialHold/types';

describe('FinancialHoldRepository class', () => {
  afterEach(() => {
    sinon.restore();
  });
  const agencyId = 'agency id';
  const clientId = 'client id';
  const aggregateId: FinancialHoldAggregateIdInterface = {
    name: 'financial_hold',
    agency_id: agencyId,
    client_id: clientId
  };

  it('Test extending from AbstractRepository', () => {
    const eventRepository = new EventRepository(EventStore, 'some-id');
    const writeProjectionHandler = new FinancialHoldWriteProjectionHandler();
    const financialHoldRepository = new FinancialHoldRepository(eventRepository, writeProjectionHandler);

    financialHoldRepository.should.be.instanceof(AbstractRepository);
  });
  describe('getAggregate()', () => {
    it('Test calling AgencyAggregate', async () => {
      const pointInTime: EventPointInTimeType = {sequence_id: 100};
      const eventRepository = new EventRepository(EventStore, 'some-id');
      const writeProjectionHandler = new FinancialHoldWriteProjectionHandler();
      const financialHoldRepository = new FinancialHoldRepository(eventRepository, writeProjectionHandler);

      const projection: any = {
        oops: 'ok'
      };

      const leftFoldEvents = sinon.stub(eventRepository, 'leftFoldEvents').resolves(projection);

      const aggregate = await financialHoldRepository.getAggregate(aggregateId, pointInTime);

      leftFoldEvents.should.have.been.calledWith(
        writeProjectionHandler,
        {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        pointInTime
      );
      aggregate.getId().agency_id.should.equal(agencyId);
    });
  });
});
