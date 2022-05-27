import sinon, {stubInterface} from 'ts-sinon';
import {CompleteUnassignConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobCommandEnum} from '../../../../src/aggregates/ConsultantJob/types';
import {CompleteUnassignConsultantCommandInterface} from '../../../../src/aggregates/ConsultantJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteUnassignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const command: CompleteUnassignConsultantCommandInterface = {
      aggregateId: {
        name: 'consultant_job',
        agency_id: agencyId
      },
      type: ConsultantJobCommandEnum.COMPLETE_UNASSIGN_CONSULTANT,
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
      const handler = new CompleteUnassignConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateCompleteJob.should.have.been.calledOnceWith(command.data._id);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED,
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
      const handler = new CompleteUnassignConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledWith(command.aggregateId);
      aggregate.validateCompleteJob.should.have.been.calledWith(command.data._id);
      repository.save.should.not.have.been.called;
    });
  });
});
