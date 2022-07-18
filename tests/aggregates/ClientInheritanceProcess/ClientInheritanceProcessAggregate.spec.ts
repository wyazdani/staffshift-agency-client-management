import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {ClientInheritanceProcessAggregate} from '../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessAggregateIdInterface} from '../../../src/aggregates/ClientInheritanceProcess/types';
import {ClientInheritanceProcessAggregateStatusEnum} from '../../../src/aggregates/ClientInheritanceProcess/types/ClientInheritanceProcessAggregateStatusEnum';

describe('ClientInheritanceProcessAggregate', () => {
  const aggregateId: ClientInheritanceProcessAggregateIdInterface = {
    name: 'client_inheritance_process',
    agency_id: 'agency id',
    job_id: 'some-id'
  };

  it('Test extend AbstractAggregate', () => {
    const aggregateRecord = {
      progressed_items: [{client_id: 'client a'}],
      last_sequence_id: 1
    };
    const aggregate = new ClientInheritanceProcessAggregate(aggregateId, aggregateRecord);

    aggregate.should.instanceof(AbstractAggregate);
  });

  describe('getProgressedItems()', () => {
    it('should return progressed items', () => {
      const aggregateRecord = {
        progressed_items: [{client_id: 'client a'}],
        last_sequence_id: 1
      };
      const aggregate = new ClientInheritanceProcessAggregate(aggregateId, aggregateRecord);

      aggregate.getProgressedItems().should.deep.equal([{client_id: 'client a'}]);
    });
    it('should return empty array if not set', () => {
      const aggregateRecord = {
        last_sequence_id: 1
      };
      const aggregate = new ClientInheritanceProcessAggregate(aggregateId, aggregateRecord);

      aggregate.getProgressedItems().should.deep.equal([]);
    });
  });

  describe('getCurrentStatus()', () => {
    it('should return current status', () => {
      const aggregateRecord = {
        status: ClientInheritanceProcessAggregateStatusEnum.STARTED,
        last_sequence_id: 1
      };
      const aggregate = new ClientInheritanceProcessAggregate(aggregateId, aggregateRecord);

      aggregate.getCurrentStatus().should.equal(ClientInheritanceProcessAggregateStatusEnum.STARTED);
    });
    it('should return status new on default', () => {
      const aggregateRecord = {
        last_sequence_id: 1
      };
      const aggregate = new ClientInheritanceProcessAggregate(aggregateId, aggregateRecord);

      aggregate.getCurrentStatus().should.equal(ClientInheritanceProcessAggregateStatusEnum.NEW);
    });
  });
});
