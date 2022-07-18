import sinon, {stubInterface} from 'ts-sinon';
import {StartClientInheritanceProcessCommandHandler} from '../../../../src/aggregates/ClientInheritanceProcess/command-handlers';
import {ClientInheritanceProcessAggregate} from '../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessRepository} from '../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandEnum} from '../../../../src/aggregates/ClientInheritanceProcess/types';
import {StartClientInheritanceProcessCommandInterface} from '../../../../src/aggregates/ClientInheritanceProcess/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('StartClientInheritanceProcessCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: StartClientInheritanceProcessCommandInterface = {
    aggregateId: {
      name: 'client_inheritance_process',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ClientInheritanceProcessCommandEnum.START_INHERITANCE_PROCESS,
    data: {
      estimated_count: 2
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
      const handler = new StartClientInheritanceProcessCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED,
          aggregate_id: aggregate.getId(),
          data: {
            estimated_count: 2
          },
          sequence_id: 3
        }
      ]);
    });
  });
});
