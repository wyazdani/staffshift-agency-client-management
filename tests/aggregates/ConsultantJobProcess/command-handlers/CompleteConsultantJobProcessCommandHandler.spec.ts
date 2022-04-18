import sinon, {stubInterface} from 'ts-sinon';
import {CompleteConsultantJobProcessCommandHandler} from '../../../../src/aggregates/ConsultantJobProcess/command-handlers/CompleteConsultantJobProcessCommandHandler';
import {ConsultantJobProcessAggregate} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessAggregate';
import {ConsultantJobProcessRepository} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandEnum} from '../../../../src/aggregates/ConsultantJobProcess/types';
import {CompleteConsultantJobProcessCommandInterface} from '../../../../src/aggregates/ConsultantJobProcess/types/CommandTypes/CompleteConsultantJobProcessCommandInterface';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteConsultantJobProcessCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: CompleteConsultantJobProcessCommandInterface = {
    aggregateId: {
      name: 'consultant_job_process',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ConsultantJobProcessCommandEnum.COMPLETE,
    data: {
      _id: 'id',
      consultant_id: 'consultant_id',
      consultant_role_id: 'consultant_role_id',
      client_ids: ['client_id']
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
      const handler = new CompleteConsultantJobProcessCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_PROCESS_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 3
        }
      ]);
    });
  });
});
