export interface AggregateCommandInterface {
  aggregateId: {[key: string]: string};
  type: string;
  data: unknown;
  optimistic_lock?: number;
}
