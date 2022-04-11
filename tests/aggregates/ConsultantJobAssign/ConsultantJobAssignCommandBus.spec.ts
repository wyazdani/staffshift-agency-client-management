import {ConsultantJobAssignCommandBus} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {EventRepository} from '../../../src/EventRepository';
import {
  StartConsultantJobAssignCommandHandler,
  SucceedItemConsultantJobAssignCommandHandler,
  FailItemConsultantJobAssignCommandHandler,
  CompleteConsultantJobAssignCommandHandler
} from '../../../src/aggregates/ConsultantJobAssign/command-handlers';

const expectedHandlers = [
  StartConsultantJobAssignCommandHandler,
  SucceedItemConsultantJobAssignCommandHandler,
  FailItemConsultantJobAssignCommandHandler,
  CompleteConsultantJobAssignCommandHandler
];

describe('ConsultantJobAssignCommandBus class', () => {
  describe('getCommandHandlers()', () => {
    /**
     * This test case exists to prevent a regression by deleting a handler
     * We also assert that each is uniquely registered
     */
    it('test all command handlers are uniquely registered', () => {
      const eventRepository = stubConstructor(EventRepository);
      const handlers = ConsultantJobAssignCommandBus.getCommandHandlers(eventRepository);
      let instanceOfCount = 0;

      assert.isTrue(
        handlers.length === expectedHandlers.length,
        'Assert we have at least the same number of handlers still registered in the class'
      );
      for (const item of expectedHandlers) {
        for (const handler of handlers) {
          if (handler instanceof item) {
            instanceOfCount++;
          }
        }
      }
      assert.isTrue(instanceOfCount === handlers.length, 'Expected the handlers to be unique');
    });
  });
});
