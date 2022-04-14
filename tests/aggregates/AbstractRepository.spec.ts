import sinon, {stubInterface} from 'ts-sinon';
import {AbstractRepository} from '../../src/aggregates/AbstractRepository';
import {EventRepository} from '../../src/EventRepository';

describe('AbstractRepository', () => {
  describe('save()', () => {
    afterEach(() => sinon.restore());
    it('Test success', async () => {
      const response: any = ['ok'];
      const events: any = ['event1', 'event2'];
      const eventRepository = stubInterface<EventRepository>();

      eventRepository.save.resolves(response);
      class Repository extends AbstractRepository {
        constructor(eventRepository: EventRepository) {
          super(eventRepository);
        }
      }
      const repository = new Repository(eventRepository);
      const result = await repository.save(events);

      eventRepository.save.should.have.been.calledWith(events);
      result.should.equal(response);
    });
  });
});
