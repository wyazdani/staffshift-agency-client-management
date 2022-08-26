import {ValidationError} from 'a24-node-error-utils';
import {FinancialHoldAggregateIdInterface, FinancialHoldAggregateRecordInterface} from './types';
import {AbstractAggregate} from '../AbstractAggregate';
import {isBoolean} from 'lodash';

export class FinancialHoldAggregate extends AbstractAggregate<
  FinancialHoldAggregateIdInterface,
  FinancialHoldAggregateRecordInterface
> {
  constructor(
    protected id: FinancialHoldAggregateIdInterface,
    protected aggregate: FinancialHoldAggregateRecordInterface
  ) {
    super(id, aggregate);
  }

  /**
   * Note: the inherited property might be `undefined`(when aggregate doesn't have any events). it means it's inherited
   * that's why we don't do `if (!this.aggregate.inherited)`
   */
  validateInherited(): void {
    if (this.aggregate.inherited === false) {
      throw new ValidationError('Operation not possible due to inheritance problem').setErrors([
        {
          code: 'NOT_INHERITED',
          message: 'node is not inherited from the parent'
        }
      ]);
    }
  }

  /**
   * returns the current financial hold
   * null means nothing is set
   */
  getFinancialHold(): boolean | null {
    return isBoolean(this.aggregate.financial_hold) ? this.aggregate.financial_hold : null;
  }

  /**
   * returns the note
   * if it's not defined it will return null
   */
  getNote(): string | null {
    return this.aggregate.note || null;
  }

  /**
   * get last event date in the aggregate
   * null means the aggregate was empty
   */
  getLastEventDate(): Date | null {
    return this.aggregate.last_event_date || null;
  }
}
