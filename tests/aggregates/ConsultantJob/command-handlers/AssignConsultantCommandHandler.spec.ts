import sinon, {stubInterface} from 'ts-sinon';
import {AssignConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers/AssignConsultantCommandHandler';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobCommandEnum} from '../../../../src/aggregates/ConsultantJob/types';
import {AssignConsultantCommandInterface} from '../../../../src/aggregates/ConsultantJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('AssignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const command: AssignConsultantCommandInterface = {
      aggregateId: {
        name: 'consultant_job',
        agency_id: agencyId
      },
      type: ConsultantJobCommandEnum.ASSIGN_CONSULTANT,
      data: {
        _id: 'id',
        consultant_id: 'consultant_id',
        consultant_role_id: 'consultant_role_id',
        client_ids: ['client_id']
      }
    };

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const repository = stubInterface<ConsultantJobRepository>();
      const aggregate = stubInterface<ConsultantJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateAssignConsultant.resolves();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new AssignConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateAssignConsultant.should.have.been.calledOnceWith(command.data);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });
  });
});
