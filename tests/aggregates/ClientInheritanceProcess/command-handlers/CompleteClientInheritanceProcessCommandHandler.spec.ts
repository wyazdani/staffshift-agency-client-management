import sinon, {stubInterface} from 'ts-sinon';
import {CompleteClientInheritanceProcessCommandHandler} from '../../../../src/aggregates/ClientInheritanceProcess/command-handlers';
import {ClientInheritanceProcessAggregate} from '../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessAggregate';
import {ClientInheritanceProcessRepository} from '../../../../src/aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {ClientInheritanceProcessCommandEnum} from '../../../../src/aggregates/ClientInheritanceProcess/types';
import {CompleteClientInheritanceProcessCommandInterface} from '../../../../src/aggregates/ClientInheritanceProcess/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteClientInheritanceProcessCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: CompleteClientInheritanceProcessCommandInterface = {
    aggregateId: {
      name: 'client_inheritance_process',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ClientInheritanceProcessCommandEnum.COMPLETE_INHERITANCE_PROCESS,
    data: {
      _id: 'id'
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
      const handler = new CompleteClientInheritanceProcessCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 3
        }
      ]);
    });
  });
});
