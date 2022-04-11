import sinon, {stubInterface} from 'ts-sinon';
import {CompleteConsultantJobAssignCommandHandler} from '../../../../src/aggregates/ConsultantJobAssign/command-handlers/CompleteConsultantJobAssignCommandHandler';
import {ConsultantJobAssignAggregate} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandEnum} from '../../../../src/aggregates/ConsultantJobAssign/types';
import {CompleteConsultantJobAssignCommandInterface} from '../../../../src/aggregates/ConsultantJobAssign/types/CommandTypes/CompleteConsultantJobAssignCommandInterface';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteConsultantAssignCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: CompleteConsultantJobAssignCommandInterface = {
    aggregateId: {
      name: 'consultant_job_assign',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ConsultantJobAssignCommandEnum.COMPLETE,
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
      const repository = stubInterface<ConsultantJobAssignRepository>();
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const handler = new CompleteConsultantJobAssignCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 3
        }
      ]);
    });
  });
});
