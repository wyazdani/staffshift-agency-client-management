import sinon, {stubInterface} from 'ts-sinon';
import {SetFinancialHoldCommandHandler} from '../../../../src/aggregates/FinancialHold/command-handlers';
import {FinancialHoldAggregate} from '../../../../src/aggregates/FinancialHold/FinancialHoldAggregate';
import {FinancialHoldRepository} from '../../../../src/aggregates/FinancialHold/FinancialHoldRepository';
import {FinancialHoldCommandEnum} from '../../../../src/aggregates/FinancialHold/types';
import {SetFinancialHoldCommandInterface} from '../../../../src/aggregates/FinancialHold/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('SetFinancialHoldCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const note = 'sample note';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for financial hold true', async () => {
      const command: SetFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_FINANCIAL_HOLD,
        data: {
          financial_hold: true,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test success scenario for financial hold false', async () => {
      const command: SetFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_FINANCIAL_HOLD,
        data: {
          financial_hold: false,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });
  });
});
