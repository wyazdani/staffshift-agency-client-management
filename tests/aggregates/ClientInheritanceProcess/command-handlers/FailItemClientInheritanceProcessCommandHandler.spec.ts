import sinon, {stubInterface} from 'ts-sinon';
import {FailItemClientInheritanceProcessCommandHandler} from '../../../../src/aggregates/ClientInheritanceProcess/command-handlers/FailItemClientInheritanceProcessCommandHandler';
import {ClientInheritanceProcessAggregate} from '../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessRepository} from '../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandEnum} from '../../../../src/aggregates/ClientInheritanceProcess/types';
import {FailItemClientInheritanceProcessCommandInterface} from '../../../../src/aggregates/ClientInheritanceProcess/types/CommandTypes/FailItemClientInheritanceProcessCommandInterface';
import {EventsEnum} from '../../../../src/Events';

describe('FailItemClientInheritanceProcessCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: FailItemClientInheritanceProcessCommandInterface = {
    aggregateId: {
      name: 'client_inheritance_process',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ClientInheritanceProcessCommandEnum.FAIL_ITEM_INHERITANCE_PROCESS,
    data: {
      client_id: 'client id',
      errors: [{code: '400', message: 'faked'}]
    }
  };

  describe('execute()', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Test running the command', async () => {
      const eventId = 2;
      const repository = stubInterface<ClientInheritanceProcessRepository>();
      const aggregate = stubInterface<ClientInheritanceProcessAggregate>();
      const handler = new FailItemClientInheritanceProcessCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 3
        }
      ]);
    });
  });
});
