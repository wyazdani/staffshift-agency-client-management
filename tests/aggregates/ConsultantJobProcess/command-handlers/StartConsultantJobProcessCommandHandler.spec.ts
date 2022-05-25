import sinon, {stubInterface} from 'ts-sinon';
import {StartConsultantJobProcessCommandHandler} from '../../../../src/aggregates/ConsultantJobProcess/command-handlers';
import {ConsultantJobProcessAggregate} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessAggregate';
import {ConsultantJobProcessRepository} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandEnum} from '../../../../src/aggregates/ConsultantJobProcess/types';
import {StartConsultantJobProcessCommandInterface} from '../../../../src/aggregates/ConsultantJobProcess/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('StartConsultantJobProcessCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: StartConsultantJobProcessCommandInterface = {
    aggregateId: {
      name: 'consultant_job_process',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ConsultantJobProcessCommandEnum.START,
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
      const repository = stubInterface<ConsultantJobProcessRepository>();
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const handler = new StartConsultantJobProcessCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_PROCESS_STARTED,
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
