import sinon, {stubInterface} from 'ts-sinon';
import {StartConsultantJobAssignCommandHandler} from '../../../../src/aggregates/ConsultantJobAssign/command-handlers/StartConsultantJobAssignCommandHandler';
import {ConsultantJobAssignAggregate} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {EventsEnum} from '../../../../src/Events';

describe('StartConsultantAssignCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';

  describe('execute()', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Test running the command', async () => {
      const eventId = 2;
      const aggregateId: any = {sample: 'ok'};
      const repository = stubInterface<ConsultantJobAssignRepository>();
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const handler = new StartConsultantJobAssignCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(eventId);
      aggregate.getId.returns(aggregateId);
      repository.save.resolves();
      await handler.execute(agencyId, jobId, {});
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
