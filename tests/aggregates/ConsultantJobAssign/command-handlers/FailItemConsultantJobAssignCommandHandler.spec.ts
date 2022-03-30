import sinon, {stubInterface} from 'ts-sinon';
import {FailItemConsultantJobAssignCommandHandler} from '../../../../src/aggregates/ConsultantJobAssign/command-handlers/FailItemConsultantJobAssignCommandHandler';
import {ConsultantJobAssignAggregate} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignRepository} from '../../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {EventsEnum} from '../../../../src/Events';

describe('FailItemConsultantAssignCommandHandler class', () => {
  const agencyId = 'agency id';
  const jobId = 'job id';

  describe('execute()', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Test running the command', async () => {
      const eventId = 2;
      const aggregateId: any = {sample: 'ok'};
      const commandData: any = {
        client_id: 'client id',
        errors: [{sample: 'oops'}]
      };
      const repository = stubInterface<ConsultantJobAssignRepository>();
      const aggregate = stubInterface<ConsultantJobAssignAggregate>();
      const handler = new FailItemConsultantJobAssignCommandHandler(repository);

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(eventId);
      aggregate.getId.returns(aggregateId);
      repository.save.resolves();
      await handler.execute(agencyId, jobId, commandData);
      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED,
          aggregate_id: aggregate.getId(),
          data: commandData,
          sequence_id: 3
        }
      ]);
    });
  });
});
