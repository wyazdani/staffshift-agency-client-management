import sinon, {stubInterface} from 'ts-sinon';
import {AssignConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers/AssignConsultantCommandHandler';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {EventsEnum} from '../../../../src/Events';

describe('AssignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const command: any = {ok: 'sample'};
      const repository = stubInterface<ConsultantJobRepository>();
      const aggregate = stubInterface<ConsultantJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateAssignConsultant.resolves();
      aggregate.getLastEventId.returns(1);
      repository.save.resolves();
      const handler = new AssignConsultantCommandHandler(repository);

      await handler.execute(agencyId, command);
      repository.getAggregate.should.have.been.calledWith(agencyId);
      aggregate.validateAssignConsultant.should.have.been.calledWith(command);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command,
          sequence_id: 2
        }
      ]);
    });
  });
});
