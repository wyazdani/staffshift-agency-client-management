import sinon, {stubInterface} from 'ts-sinon';
import {InheritFinancialHoldClientLinkCommandHandler} from '../../../../src/aggregates/FinancialHold/command-handlers';
import {FinancialHoldAggregate} from '../../../../src/aggregates/FinancialHold/FinancialHoldAggregate';
import {FinancialHoldRepository} from '../../../../src/aggregates/FinancialHold/FinancialHoldRepository';
import {FinancialHoldCommandEnum} from '../../../../src/aggregates/FinancialHold/types';
import {InheritFinancialHoldClientLinkCommandInterface} from '../../../../src/aggregates/FinancialHold/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('InheritFinancialHoldClientLinkCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const note = 'sample note';

    afterEach(() => {
      sinon.restore();
    });
    it('Test financial hold true on payload', async () => {
      const command: InheritFinancialHoldClientLinkCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
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
      const handler = new InheritFinancialHoldClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test financial hold false on payload', async () => {
      const command: InheritFinancialHoldClientLinkCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
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
      const handler = new InheritFinancialHoldClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test null on payload and aggregate is not empty', async () => {
      const command: InheritFinancialHoldClientLinkCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: null,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new InheritFinancialHoldClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test null on payload and aggregate is not empty', async () => {
      const command: InheritFinancialHoldClientLinkCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: null,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(0);
      repository.save.resolves();
      const handler = new InheritFinancialHoldClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.not.have.been.called;
    });
  });
});
