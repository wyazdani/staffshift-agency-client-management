import sinon, {stubInterface} from 'ts-sinon';
import {CompleteAssignConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers/CompleteAssignConsultantCommandHandler';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {CompleteAssignConsultantCommandDataInterface} from '../../../../src/aggregates/ConsultantJob/types/CommandDataTypes';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteAssignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const command: CompleteAssignConsultantCommandDataInterface = {_id: 'job id'};
      const repository = stubInterface<ConsultantJobRepository>();
      const aggregate = stubInterface<ConsultantJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateCompleteJob.returns(true);
      aggregate.getLastEventId.returns(1);
      repository.save.resolves();
      const handler = new CompleteAssignConsultantCommandHandler(repository);

      await handler.execute(agencyId, command);
      repository.getAggregate.should.have.been.calledWith(agencyId);
      aggregate.validateCompleteJob.should.have.been.calledWith(command._id);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command,
          sequence_id: 2
        }
      ]);
    });

    it('Test failure scenario', async () => {
      const command: CompleteAssignConsultantCommandDataInterface = {_id: 'job id'};
      const repository = stubInterface<ConsultantJobRepository>();
      const aggregate = stubInterface<ConsultantJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateCompleteJob.returns(false);
      aggregate.getLastEventId.returns(1);
      repository.save.resolves();
      const handler = new CompleteAssignConsultantCommandHandler(repository);

      await handler.execute(agencyId, command);
      repository.getAggregate.should.have.been.calledWith(agencyId);
      aggregate.validateCompleteJob.should.have.been.calledWith(command._id);
      repository.save.should.not.have.been.called;
    });
  });
});
