import sinon, {stubInterface} from 'ts-sinon';
import {StartConsultantJobAssignCommandHandler} from '../../../../src/aggregates/ConsultantJobAssign/command-handlers/StartConsultantJobAssignCommandHandler';
import {ConsultantJobAssignAggregate} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandEnum} from '../../../../src/aggregates/ConsultantJobAssign/types';
import {StartConsultantJobAssignCommandInterface} from '../../../../src/aggregates/ConsultantJobAssign/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('StartConsultantAssignCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: StartConsultantJobAssignCommandInterface = {
    aggregateId: {
      name: 'consultant_job_assign',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ConsultantJobAssignCommandEnum.START,
    data: {}
  };

  describe('execute()', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Test running the command', async () => {
      const eventId = 2;
      const repository = stubInterface<ConsultantJobAssignRepository>();
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const handler = new StartConsultantJobAssignCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_STARTED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 3
        }
      ]);
    });
  });
});
