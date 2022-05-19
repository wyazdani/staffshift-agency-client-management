import sinon, {stubInterface} from 'ts-sinon';
import {UnassignConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers/UnassignConsultantCommandHandler';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobCommandEnum} from '../../../../src/aggregates/ConsultantJob/types';
import {UnassignConsultantCommandInterface} from '../../../../src/aggregates/ConsultantJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('UnassignConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const command: UnassignConsultantCommandInterface = {
      aggregateId: {
        name: 'consultant_job',
        agency_id: agencyId
      },
      type: ConsultantJobCommandEnum.UNASSIGN_CONSULTANT,
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
      aggregate.validateUnassignConsultant.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new UnassignConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateUnassignConsultant.should.have.been.calledOnceWith(command.data);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });
  });
});
