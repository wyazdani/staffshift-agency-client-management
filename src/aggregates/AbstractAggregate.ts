import {BaseAggregateRecordInterface} from 'BaseAggregateRecordInterface';

export abstract class AbstractAggregate<Id, Record extends BaseAggregateRecordInterface> {
  constructor(protected id: Id, protected aggregate: Record) {}

  getId(): Id {
    return this.id;
  }

  getLastSequenceId(): number {
    return this.aggregate.last_sequence_id;
  }

  toJSON(): Record {
    return this.aggregate;
  }
}
