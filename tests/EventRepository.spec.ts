import sinon from 'ts-sinon';
import {SequenceIdMismatch} from '../src/errors/SequenceIdMismatch';
import {EventRepository} from '../src/EventRepository';
import {EventStore} from '../src/models/EventStore';

describe('EventRepository', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('leftFoldEvents()', () => {
    //TODO: we need to write test cases for it
  });
  describe('save()', () => {
    const correlationId = 'sample';
    const eventMeta = {
      user_id: 'user id'
    };
    const causationId = 'causation id';

    it('Test success', async () => {
      const event: any = {sample: 'ok'};
      const insertMany = sinon.stub(EventStore, 'insertMany').resolves();
      const repository = new EventRepository(EventStore, correlationId, eventMeta, causationId);

      await repository.save([event]);
      insertMany.should.have.been.calledWith([
        {
          ...event,
          correlation_id: correlationId,
          meta_data: eventMeta,
          causation_id: causationId
        }
      ]);
    });

    it('Test failure on sequence id mismatch', async () => {
      const event: any = {sample: 'ok'};
      const insertMany = sinon.stub(EventStore, 'insertMany').rejects({code: 11000});
      const repository = new EventRepository(EventStore, correlationId, eventMeta, causationId);

      await repository.save([event]).should.have.been.rejectedWith(SequenceIdMismatch);
      insertMany.should.have.been.calledWith([
        {
          ...event,
          correlation_id: correlationId,
          meta_data: eventMeta,
          causation_id: causationId
        }
      ]);
    });
  });
});
