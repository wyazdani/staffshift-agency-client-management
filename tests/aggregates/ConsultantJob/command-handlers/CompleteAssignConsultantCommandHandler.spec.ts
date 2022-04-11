import sinon, {stubInterface} from 'ts-sinon';
import {CompleteAssignConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers/CompleteAssignConsultantCommandHandler';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobCommandEnum} from '../../../../src/aggregates/ConsultantJob/types';
import {CompleteAssignConsultantCommandInterface} from '../../../../src/aggregates/ConsultantJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteAssignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const command: CompleteAssignConsultantCommandInterface = {
      aggregateId: {
        name: 'consultant_job',
        agency_id: agencyId
      },
      type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT,
      data: {
        _id: 'id'
      }
    };

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const repository = stubInterface<ConsultantJobRepository>();
      const aggregate = stubInterface<ConsultantJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateCompleteJob.returns(true);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new CompleteAssignConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateCompleteJob.should.have.been.calledOnceWith(command.data._id);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });

    it('Test failure scenario', async () => {
      const repository = stubInterface<ConsultantJobRepository>();
      const aggregate = stubInterface<ConsultantJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateCompleteJob.returns(false);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new CompleteAssignConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledWith(command.aggregateId);
      aggregate.validateCompleteJob.should.have.been.calledWith(command.data._id);
      repository.save.should.not.have.been.called;
    });
  });
});
