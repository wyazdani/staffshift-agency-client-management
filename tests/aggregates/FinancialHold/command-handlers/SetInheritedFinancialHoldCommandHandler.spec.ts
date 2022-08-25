import {ValidationError} from 'a24-node-error-utils';
import sinon, {stubInterface} from 'ts-sinon';
import {SetInheritedFinancialHoldCommandHandler} from '../../../../src/aggregates/FinancialHold/command-handlers';
import {FinancialHoldAggregate} from '../../../../src/aggregates/FinancialHold/FinancialHoldAggregate';
import {FinancialHoldRepository} from '../../../../src/aggregates/FinancialHold/FinancialHoldRepository';
import {FinancialHoldCommandEnum} from '../../../../src/aggregates/FinancialHold/types';
import {SetInheritedFinancialHoldCommandInterface} from '../../../../src/aggregates/FinancialHold/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('SetInheritedFinancialHoldCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const note = 'sample note';

    afterEach(() => {
      sinon.restore();
    });
    it('Test financial hold true on payload', async () => {
      const command: SetInheritedFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
        data: {
          financial_hold: true,
          force: false,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetInheritedFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
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
      const command: SetInheritedFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
        data: {
          financial_hold: false,
          force: false,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetInheritedFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test null on payload', async () => {
      const command: SetInheritedFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
        data: {
          financial_hold: null,
          force: false,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetInheritedFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test when force is enabled', async () => {
      const command: SetInheritedFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
        data: {
          financial_hold: true,
          force: true,
          note
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetInheritedFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.not.have.been.called;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {note},
          sequence_id: 2
        }
      ]);
    });

    it('Test throw error if validateInherited() throws an exception', async () => {
      const command: SetInheritedFinancialHoldCommandInterface = {
        aggregateId: {
          name: 'financial_hold',
          agency_id: agencyId,
          client_id: clientId
        },
        type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
        data: {
          financial_hold: null,
          force: false
        }
      };
      const repository = stubInterface<FinancialHoldRepository>();
      const aggregate = stubInterface<FinancialHoldAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.throws(new ValidationError('sample'));
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new SetInheritedFinancialHoldCommandHandler(repository);

      await handler.execute(command).should.have.been.rejectedWith(ValidationError);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.not.have.been.called;
    });
  });
});
