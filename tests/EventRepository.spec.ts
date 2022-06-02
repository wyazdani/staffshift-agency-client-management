import {ClientSession} from 'mongoose';
import sinon, {stubInterface} from 'ts-sinon';
import {SequenceIdMismatch} from '../src/errors/SequenceIdMismatch';
import {EventRepository, EventPointInTimeType} from '../src/EventRepository';
import {EventStore, AggregateIdType} from '../src/models/EventStore';
import {WriteProjectionInterface} from '../src/types/WriteProjectionInterface';

describe('EventRepository', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('leftFoldEvents()', () => {
    const correlationId = 'sample';
    const eventMeta = {
      user_id: 'user id'
    };

    it('Test success with no point in time', async () => {
      const event: any = {sample: 'ok'};
      const fakeCursor: any = {
        sort: () => fakeCursor,
        lean: async () => [event]
      };
      const find = sinon.stub(EventStore, 'find').returns(fakeCursor);
      const repository = new EventRepository(EventStore, correlationId, eventMeta);
      const projection: WriteProjectionInterface<any> = {execute: sinon.stub()};
      const aggregateId: AggregateIdType = {name: 'test', _id: 'some_id'};

      await repository.leftFoldEvents(projection, aggregateId);
      find.should.have.been.calledOnceWith({aggregate_id: aggregateId});
      projection.execute.should.have.been.calledOnce;
    });

    it('Test success with point in time - sequence_id', async () => {
      const event: any = {sample: 'ok'};
      const fakeCursor: any = {
        sort: () => fakeCursor,
        lean: async () => [event]
      };
      const find = sinon.stub(EventStore, 'find').returns(fakeCursor);
      const repository = new EventRepository(EventStore, correlationId, eventMeta);
      const projection: WriteProjectionInterface<any> = {execute: sinon.stub()};
      // const execute = sinon.spy(projection, 'execute');
      const aggregateId: AggregateIdType = {name: 'test', _id: 'some_id'};
      const pointInTime: EventPointInTimeType = {sequence_id: 2};

      await repository.leftFoldEvents(projection, aggregateId, pointInTime);
      find.should.have.been.calledOnceWith({
        aggregate_id: aggregateId,
        sequence_id: {$lte: 2}
      });
      projection.execute.should.have.been.calledOnce;
    });

    it('Test success with point in time - created_at', async () => {
      const event: any = {sample: 'ok'};
      const fakeCursor: any = {
        sort: () => fakeCursor,
        lean: async () => [event]
      };
      const find = sinon.stub(EventStore, 'find').returns(fakeCursor);
      const repository = new EventRepository(EventStore, correlationId, eventMeta);
      const projection: WriteProjectionInterface<any> = {execute: sinon.stub()};
      // const execute = sinon.spy(projection, 'execute');
      const aggregateId: AggregateIdType = {name: 'test', _id: 'some_id'};
      const date = new Date('2002-02-02T02:02:02Z');
      const pointInTime: EventPointInTimeType = {created_at: date};

      await repository.leftFoldEvents(projection, aggregateId, pointInTime);
      find.should.have.been.calledOnceWith({
        aggregate_id: aggregateId,
        created_at: {$lte: date}
      });
      projection.execute.should.have.been.calledOnce;
    });
  });

  describe('save()', () => {
    const correlationId = 'sample';
    const eventMeta = {
      user_id: 'user id'
    };

    it('Test one event inserts it directly', async () => {
      const event: any = {sample: 'ok'};
      const create = sinon.stub(EventStore, 'create').resolves();
      const repository = new EventRepository(EventStore, correlationId, eventMeta);

      await repository.save([event]);
      create.should.have.been.calledWith({
        ...event,
        correlation_id: correlationId,
        meta_data: eventMeta
      });
    });
    it('Test multiple event success scenario', async () => {
      const eventA: any = {sample: 'ok'};
      const eventB: any = {sample: 'ok2'};
      const session = stubInterface<ClientSession>();
      const insertMany = sinon.stub(EventStore, 'insertMany').resolves();

      session.withTransaction.callsFake((func) => {
        func(session);
        return Promise.resolve();
      });
      session.endSession.resolves();
      const startSession = sinon.stub(EventStore, 'startSession').resolves(session as any);
      const repository = new EventRepository(EventStore, correlationId, eventMeta);

      await repository.save([eventA, eventB]);
      insertMany.should.have.been.calledWith([
        {
          ...eventA,
          correlation_id: correlationId,
          meta_data: eventMeta
        },
        {
          ...eventB,
          correlation_id: correlationId,
          meta_data: eventMeta
        }
      ]);
      startSession.should.have.been.calledOnce;
      session.endSession.should.have.been.calledOnce;
      session.withTransaction.should.have.been.calledOnce;
    });

    it('Test multiple event failure scenario: make sure it ends the session', async () => {
      const eventA: any = {sample: 'ok'};
      const eventB: any = {sample: 'ok2'};
      const session = stubInterface<ClientSession>();
      const error = new Error('sample error');

      session.withTransaction.rejects(error);
      session.endSession.resolves();
      const startSession = sinon.stub(EventStore, 'startSession').resolves(session as any);
      const repository = new EventRepository(EventStore, correlationId, eventMeta);

      await repository.save([eventA, eventB]).should.have.been.rejectedWith(error);

      startSession.should.have.been.calledOnce;
      session.endSession.should.have.been.calledOnce;
      session.withTransaction.should.have.been.calledOnce;
    });
    it('Test failure on sequence id mismatch', async () => {
      const eventA: any = {sample: 'ok'};
      const eventB: any = {sample: 'ok2'};
      const session = stubInterface<ClientSession>();

      session.withTransaction.rejects({code: 11000});
      session.endSession.resolves();
      const startSession = sinon.stub(EventStore, 'startSession').resolves(session as any);
      const repository = new EventRepository(EventStore, correlationId, eventMeta);

      await repository.save([eventA, eventB]).should.have.been.rejectedWith(SequenceIdMismatch);

      startSession.should.have.been.calledOnce;
      session.endSession.should.have.been.calledOnce;
      session.withTransaction.should.have.been.calledOnce;
    });
  });
});
