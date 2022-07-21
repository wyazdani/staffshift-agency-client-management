import {assert} from 'chai';
import {AbstractAggregate} from '../../../src/aggregates/AbstractAggregate';
import {PaymentTermAggregate} from '../../../src/aggregates/PaymentTerm/PaymentTermAggregate';
import {ValidationError} from 'a24-node-error-utils';
import {PaymentTermAggregateIdInterface} from '../../../src/aggregates/PaymentTerm/types';

describe('PaymentTermAggregate', () => {
  const aggregateId: PaymentTermAggregateIdInterface = {
    name: 'payment_term',
    agency_id: 'agency id',
    client_id: 'client id'
  };

  it('Test inheritance of AbstractAggregate', () => {
    const aggregate = {
      last_sequence_id: 0
    };
    const paymentTermAggregate = new PaymentTermAggregate(aggregateId, aggregate);

    paymentTermAggregate.should.be.instanceof(AbstractAggregate);
  });
  describe('validateInherited', () => {
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
});
