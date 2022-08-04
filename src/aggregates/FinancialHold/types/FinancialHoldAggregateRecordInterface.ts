import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export interface FinancialHoldAggregateRecordInterface extends BaseAggregateRecordInterface {
  inherited?: boolean;
  financial_hold?: boolean | null;
  last_event_date?: Date;
  note?: string | null;
}
