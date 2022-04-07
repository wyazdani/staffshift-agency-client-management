export interface AggregateCommandInterface {
  aggregateId: {[key: string]: string};
  type: string;
  data: unknown;
}
