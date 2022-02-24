import sinon, {stubInterface} from 'ts-sinon';
import {AssignConsultantCommandHandler} from '../../../src/Consultant/command-handlers/AssignConsultantCommandHandler';
import {ConsultantAggregate} from '../../../src/Consultant/ConsultantAggregate';
import {ConsultantRepository} from '../../../src/Consultant/ConsultantRepository';
import {EventsEnum} from '../../../src/Events';

describe('AssignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const command: any = {ok: 'sample'};
      const repository = stubInterface<ConsultantRepository>();
      const aggregate = stubInterface<ConsultantAggregate>();

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
          type: EventsEnum.CONSULTANT_ASSIGN_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command,
          sequence_id: 2
        }
      ]);
    });
  });
});
