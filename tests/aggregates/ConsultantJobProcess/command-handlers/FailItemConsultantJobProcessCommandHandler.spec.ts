import sinon, {stubInterface} from 'ts-sinon';
import {FailItemConsultantJobProcessCommandHandler} from '../../../../src/aggregates/ConsultantJobProcess/command-handlers/FailItemConsultantJobProcessCommandHandler';
import {ConsultantJobProcessAggregate} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessAggregate';
import {ConsultantJobProcessRepository} from '../../../../src/aggregates/ConsultantJobProcess/ConsultantJobProcessRepository';
import {ConsultantJobProcessCommandEnum} from '../../../../src/aggregates/ConsultantJobProcess/types';
import {FailItemConsultantJobProcessCommandInterface} from '../../../../src/aggregates/ConsultantJobProcess/types/CommandTypes/FailItemConsultantJobProcessCommandInterface';
import {EventsEnum} from '../../../../src/Events';

describe('FailItemConsultantJobProcessCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';
  const command: FailItemConsultantJobProcessCommandInterface = {
    aggregateId: {
      name: 'consultant_job_process',
      agency_id: agencyId,
      job_id: jobId
    },
    type: ConsultantJobProcessCommandEnum.FAIL_ITEM,
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
      const repository = stubInterface<ConsultantJobProcessRepository>();
      const aggregate = stubInterface<ConsultantJobProcessAggregate>();
      const handler = new FailItemConsultantJobProcessCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(eventId);
      aggregate.getId.returns(command.aggregateId);
      repository.save.resolves();
      await handler.execute(command);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_FAILED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 3
        }
      ]);
    });
  });
});
