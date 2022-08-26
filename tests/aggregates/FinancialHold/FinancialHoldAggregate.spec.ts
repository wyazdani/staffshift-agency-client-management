import {ValidationError} from 'a24-node-error-utils';
import {assert} from 'chai';
import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {FinancialHoldAggregate} from '../../../src/aggregates/FinancialHold/FinancialHoldAggregate';
import {
  FinancialHoldAggregateIdInterface,
  FinancialHoldAggregateRecordInterface
} from '../../../src/aggregates/FinancialHold/types';

describe('FinancialHoldAggregate', () => {
  const aggregateId: FinancialHoldAggregateIdInterface = {
    name: 'financial_hold',
    agency_id: 'agency id',
    client_id: 'client id'
  };

  it('Test inheritance of AbstractAggregate', () => {
    const aggregate: FinancialHoldAggregateRecordInterface = {
      last_sequence_id: 0
    };
    const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

    financialHoldAggregate.should.be.instanceof(AbstractAggregate);
  });
  describe('validateInherited()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      financialHoldAggregate.validateInherited();
    });

    it('Test when financial hold is inherited', async () => {
      const aggregate = {
        last_sequence_id: 1,
        inherited: true
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      financialHoldAggregate.validateInherited();
    });

    it('Test throw error when financial hold is not inherited', async () => {
      const aggregate = {
        last_sequence_id: 1,
        inherited: false
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      try {
        financialHoldAggregate.validateInherited();
        assert.fail('It should not happen');
      } catch (error) {
        error.assertEqual(
          new ValidationError('Operation not possible due to inheritance problem').setErrors([
            {
              code: 'NOT_INHERITED',
              message: 'node is not inherited from the parent'
            }
          ])
        );
      }
    });
  });

  describe('getFinancialHold()', () => {
    it('Test returns false ', async () => {
      const aggregate = {
        last_sequence_id: 0,
        financial_hold: false
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      financialHoldAggregate.getFinancialHold().should.be.false;
    });

    it('Test returns financial hold', async () => {
      const aggregate: FinancialHoldAggregateRecordInterface = {
        last_sequence_id: 1,
        financial_hold: true
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      financialHoldAggregate.getFinancialHold().should.be.true;
    });
  });

  describe('getNote()', () => {
    it('Test returns null when it is not set', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      (financialHoldAggregate.getNote() === null).should.be.true;
    });

    it('Test returns note', async () => {
      const aggregate: FinancialHoldAggregateRecordInterface = {
        last_sequence_id: 1,
        note: 'sample'
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      financialHoldAggregate.getNote().should.equal('sample');
    });
  });

  describe('getLastEventDate()', () => {
    it('Test returns null on empty aggregate', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      (financialHoldAggregate.getLastEventDate() === null).should.be.true;
    });

    it('Test returns last event date', async () => {
      const date = new Date();
      const aggregate: FinancialHoldAggregateRecordInterface = {
        last_sequence_id: 1,
        last_event_date: date
      };
      const financialHoldAggregate = new FinancialHoldAggregate(aggregateId, aggregate);

      financialHoldAggregate.getLastEventDate().should.equal(date);
    });
  });
});
