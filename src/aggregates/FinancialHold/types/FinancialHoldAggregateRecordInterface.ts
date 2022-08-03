import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface FinancialHoldAggregateRecordInterface extends BaseAggregateRecordInterface {
  inherited?: boolean;
  financial_hold?: boolean | null;
}
