import sinon, {stubInterface} from 'ts-sinon';
import {TransferConsultantCommandHandler} from '../../../../src/aggregates/ConsultantJob/command-handlers';
import {ConsultantJobAggregate} from '../../../../src/aggregates/ConsultantJob/ConsultantJobAggregate';
import {ConsultantJobRepository} from '../../../../src/aggregates/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobCommandEnum} from '../../../../src/aggregates/ConsultantJob/types';
import {TransferConsultantCommandInterface} from '../../../../src/aggregates/ConsultantJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('TransferConsultantCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const command: TransferConsultantCommandInterface = {
      aggregateId: {
        name: 'consultant_job',
        agency_id: agencyId
      },
      type: ConsultantJobCommandEnum.TRANSFER_CONSULTANT,
      data: {
        _id: 'id',
        from_consultant_id: 'consultant_id',
        to_consultant_id: 'consultant id 2',
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
      aggregate.validateTransferConsultant.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new TransferConsultantCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateTransferConsultant.should.have.been.calledOnceWith(command.data);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });
  });
});
