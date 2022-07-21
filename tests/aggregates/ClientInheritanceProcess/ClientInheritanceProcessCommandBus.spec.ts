import {ClientInheritanceProcessCommandBus} from '../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessCommandBus';
import {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {EventRepository} from '../../../src/EventRepository';
import {
  StartClientInheritanceProcessCommandHandler,
  SucceedItemClientInheritanceProcessCommandHandler,
  FailItemClientInheritanceProcessCommandHandler,
  CompleteClientInheritanceProcessCommandHandler
} from '../../../src/aggregates/ClientInheritanceProcess/command-handlers';

const expectedHandlers = [
  StartClientInheritanceProcessCommandHandler,
  SucceedItemClientInheritanceProcessCommandHandler,
  FailItemClientInheritanceProcessCommandHandler,
  CompleteClientInheritanceProcessCommandHandler
];

describe('ClientInheritanceProcessCommandBus class', () => {
  describe('getCommandHandlers()', () => {
    /**
     * This test case exists to prevent a regression by deleting a handler
     * We also assert that each is uniquely registered
     */
    it('test all command handlers are uniquely registered', () => {
      const eventRepository = stubConstructor(EventRepository);
      const handlers = ClientInheritanceProcessCommandBus.getCommandHandlers(eventRepository);
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
