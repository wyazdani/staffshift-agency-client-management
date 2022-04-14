import sinon, {stubInterface} from 'ts-sinon';
import {FailItemConsultantJobAssignCommandHandler} from '../../../../src/aggregates/ConsultantJobAssign/command-handlers/FailItemConsultantJobAssignCommandHandler';
import {ConsultantJobAssignAggregate} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignCommandEnum} from '../../../../src/aggregates/ConsultantJobAssign/types';
import {FailItemConsultantJobAssignCommandInterface} from '../../../../src/aggregates/ConsultantJobAssign/types/CommandTypes/FailItemConsultantJobAssignCommandInterface';
import {EventsEnum} from '../../../../src/Events';

describe('FailItemConsultantAssignCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: FailItemConsultantJobAssignCommandInterface = {
    aggregateId: {
      name: 'consultant_job_assign',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
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
      const repository = stubInterface<ConsultantJobAssignRepository>();
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const handler = new FailItemConsultantJobAssignCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 3
        }
      ]);
    });
  });
});
