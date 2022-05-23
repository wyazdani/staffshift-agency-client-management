import {ConsultantJobProcessAggregate} from '../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessAggregate';
import {ConsultantJobProcessAggregateIdInterface} from '../../../src/aggregates/ConsultantJobProcess/types';

describe('ConsultantJobProcessAggregate', () => {
  const aggregateId: ConsultantJobProcessAggregateIdInterface = {
    name: 'consultant_job_process',
    agency_id: 'agency id',
    job_id: 'some-id'
  };

  describe('getProgressedClientIds()', () => {
    it('should return progressed client ids', () => {
      const aggregateRecord = {
        progressed_client_ids: ['client a'],
        last_sequence_id: 1
      };
      const aggregate = new ConsultantJobProcessAggregate(aggregateId, aggregateRecord);

      aggregate.getProgressedItems().should.deep.equal(['client a']);
    });
    it('should return empty array if not set', () => {
      const aggregateRecord = {
        last_sequence_id: 1
      };
      const aggregate = new ConsultantJobProcessAggregate(aggregateId, aggregateRecord);

      aggregate.getProgressedItems().should.deep.equal([]);
    });
  });

  describe('getId()', () => {
    it('should return aggregate id', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const agencyClientAggregate = new ConsultantJobProcessAggregate(aggregateId, aggregate);
      const id = agencyClientAggregate.getId();

      id.should.equal(aggregateId);
    });
  });

  describe('getLastSequenceId()', () => {
    it('should return aggregate last event id', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const consultantJobAggregate = new ConsultantJobProcessAggregate(aggregateId, aggregate);
      const id = consultantJobAggregate.getLastSequenceId();

      id.should.equal(1);
    });
  });

  describe('toJSON()', () => {
    it('should return the aggregate', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const consultantJobAggregate = new ConsultantJobProcessAggregate(aggregateId, aggregate);
      const id = consultantJobAggregate.toJSON();

      id.should.equal(aggregate);
    });
  });
});
