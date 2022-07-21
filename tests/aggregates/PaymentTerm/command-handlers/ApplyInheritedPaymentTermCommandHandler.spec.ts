import {ValidationError} from 'a24-node-error-utils';
import sinon, {stubInterface} from 'ts-sinon';
import {ApplyInheritedPaymentTermCommandHandler} from '../../../../src/aggregates/PaymentTerm/command-handlers';
import {PaymentTermAggregate} from '../../../../src/aggregates/PaymentTerm/PaymentTermAggregate';
import {PaymentTermRepository} from '../../../../src/aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermCommandEnum} from '../../../../src/aggregates/PaymentTerm/types';
import {ApplyInheritedPaymentTermCommandInterface} from '../../../../src/aggregates/PaymentTerm/types/CommandTypes';
import {PAYMENT_TERM_ENUM} from '../../../../src/aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';
import {EventsEnum} from '../../../../src/Events';

describe('ApplyInheritedPaymentTermCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test credit on payload', async () => {
      const command: ApplyInheritedPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT,
          force: false
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyInheritedPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test pay_in_advance on payload', async () => {
      const command: ApplyInheritedPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.PAY_IN_ADVANCE,
          force: false
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyInheritedPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test null on payload', async () => {
      const command: ApplyInheritedPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: null,
          force: false
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyInheritedPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test when force is enabled', async () => {
      const command: ApplyInheritedPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: null,
          force: true
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.returns();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyInheritedPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.not.have.been.called;
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test throw error if validateInherited() throws an exception', async () => {
      const command: ApplyInheritedPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: null,
          force: false
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInherited.throws(new ValidationError('sample'));
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyInheritedPaymentTermCommandHandler(repository);

      await handler.execute(command).should.have.been.rejectedWith(ValidationError);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInherited.should.have.been.calledOnce;
      repository.save.should.not.have.been.called;
    });
  });
});
