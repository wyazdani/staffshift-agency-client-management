import {AbstractAggregate} from '../../src/aggregates/AbstractAggregate';
import {BaseAggregateRecordInterface} from '../../src/types/BaseAggregateRecordInterface';

describe('AbstractAggregate', () => {
  interface IdInterface {
    name: string;
  }
  interface RecordInterface extends BaseAggregateRecordInterface {
    ok: string;
  }
  class Aggregate extends AbstractAggregate<IdInterface, RecordInterface> {}
  const id: IdInterface = {name: 'hi'};
  const record: RecordInterface = {ok: 'oops', last_sequence_id: 10};
  const aggregate = new Aggregate(id, record);

  it('getId()', () => {
    aggregate.getId().should.equal(id);
  });
  it('getLastSequenceId()', () => {
    aggregate.getLastSequenceId().should.equal(10);
  });
  it('toJSON()', () => {
    aggregate.toJSON().should.equal(record);
  });
});
