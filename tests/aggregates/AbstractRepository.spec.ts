import sinon, {stubInterface} from 'ts-sinon';
import {AbstractRepository} from '../../src/aggregates/AbstractRepository';
import {EventRepository} from '../../src/EventRepository';
import {AgencyAggregate} from '../../src/aggregates/Agency/AgencyAggregate';
import {AggregateIdType} from '../../src/models/EventStore';

describe('AbstractRepository', () => {
  describe('save()', () => {
    afterEach(() => sinon.restore());
    it('Test success', async () => {
      const response: any = ['ok'];
      const events: any = ['event1', 'event2'];
      const eventRepository = stubInterface<EventRepository>();

      eventRepository.save.resolves(response);
      class Repository extends AbstractRepository<AgencyAggregate> {
        getAggregate(aggregateId: AggregateIdType, pointInTime?: any): Promise<AgencyAggregate> {
          throw new Error('Method not implemented.');
        }
        constructor(eventRepository: EventRepository) {
          super(eventRepository);
        }
      }
      const repository = new Repository(eventRepository);

      await repository.save(events);

      eventRepository.save.should.have.been.calledWith(events);
    });
  });
});
