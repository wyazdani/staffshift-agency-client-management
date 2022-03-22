import {ConsultantJobAssignAggregate} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';

describe('ConsultantJobAssignAggregate', () => {
  const aggregateId = {
    name: 'consultant_job_assign',
    agency_id: 'agency id',
    job_id: 'some-id'
  };

  describe('getProgressedClientIds()', () => {
    it('should return progressed client ids', () => {
      const aggregateRecord = {
        progressed_client_ids: ['client a'],
        last_sequence_id: 1
      };
      const aggregate = new ConsultantJobAssignAggregate(aggregateId, aggregateRecord);

      aggregate.getProgressedClientIds().should.deep.equal(['client a']);
    });
    it('should return empty array if not set', () => {
      const aggregateRecord = {
        last_sequence_id: 1
      };
      const aggregate = new ConsultantJobAssignAggregate(aggregateId, aggregateRecord);

      aggregate.getProgressedClientIds().should.deep.equal([]);
    });
  });

  describe('getId()', () => {
    it('should return aggregate id', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const agencyClientAggregate = new ConsultantJobAssignAggregate(aggregateId, aggregate);
      const id = agencyClientAggregate.getId();

      id.should.equal(aggregateId);
    });
  });

  describe('getLastEventId()', () => {
    it('should return aggregate last event id', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const consultantJobAggregate = new ConsultantJobAssignAggregate(aggregateId, aggregate);
      const id = consultantJobAggregate.getLastEventId();

      id.should.equal(1);
    });
  });

  describe('toJSON()', () => {
    it('should return the aggregate', () => {
      const aggregate = {
        last_sequence_id: 1
      };
      const consultantJobAggregate = new ConsultantJobAssignAggregate(aggregateId, aggregate);
      const id = consultantJobAggregate.toJSON();

      id.should.equal(aggregate);
    });
  });
});
