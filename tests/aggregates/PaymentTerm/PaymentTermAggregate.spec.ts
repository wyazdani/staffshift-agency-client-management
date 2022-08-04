import {ValidationError} from 'a24-node-error-utils';
import {assert} from 'chai';
import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {PaymentTermAggregate} from '../../../src/aggregates/PaymentTerm/PaymentTermAggregate';
import {
  PaymentTermAggregateIdInterface,
  PaymentTermAggregateRecordInterface
} from '../../../src/aggregates/PaymentTerm/types';
import {PAYMENT_TERM_ENUM} from '../../../src/aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';

describe('PaymentTermAggregate', () => {
  const aggregateId: PaymentTermAggregateIdInterface = {
    name: 'payment_term',
    agency_id: 'agency id',
    client_id: 'client id'
  };

  it('Test inheritance of AbstractAggregate', () => {
    const aggregate: PaymentTermAggregateRecordInterface = {
      last_sequence_id: 0
    };
    const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

    paymentTermAggregate.should.be.instanceof(AbstractAggregate);
  });
  describe('validateInherited()', () => {
    it('Test when aggregate does not have any events in it', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      paymentTermAggregate.validateInherited();
    });

    it('Test when payment term is inherited', async () => {
      const aggregate = {
        last_sequence_id: 1,
        inherited: true
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      paymentTermAggregate.validateInherited();
    });

    it('Test throw error when payment term is not inherited', async () => {
      const aggregate = {
        last_sequence_id: 1,
        inherited: false
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      try {
        paymentTermAggregate.validateInherited();
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

  describe('getPaymentTerm()', () => {
    it('Test returns null when it is not set', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      (paymentTermAggregate.getPaymentTerm() === null).should.be.true;
    });

    it('Test returns payment term', async () => {
      const aggregate: PaymentTermAggregateRecordInterface = {
        last_sequence_id: 1,
        payment_term: PAYMENT_TERM_ENUM.CREDIT
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      paymentTermAggregate.getPaymentTerm().should.equal(PAYMENT_TERM_ENUM.CREDIT);
    });
  });

  describe('getLastEventDate()', () => {
    it('Test returns null on empty aggregate', async () => {
      const aggregate = {
        last_sequence_id: 0
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      (paymentTermAggregate.getLastEventDate() === null).should.be.true;
    });

    it('Test returns last event date', async () => {
      const date = new Date();
      const aggregate: PaymentTermAggregateRecordInterface = {
        last_sequence_id: 1,
        last_event_date: date
      };
      const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

      paymentTermAggregate.getLastEventDate().should.equal(date);
    });
  });
});
