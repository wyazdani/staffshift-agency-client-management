import sinon, {stubInterface} from 'ts-sinon';
import {InheritPaymentTermClientLinkCommandHandler} from '../../../../src/aggregates/PaymentTerm/command-handlers';
import {PaymentTermAggregate} from '../../../../src/aggregates/PaymentTerm/PaymentTermAggregate';
import {PaymentTermRepository} from '../../../../src/aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermCommandEnum} from '../../../../src/aggregates/PaymentTerm/types';
import {InheritPaymentTermClientLinkCommandInterface} from '../../../../src/aggregates/PaymentTerm/types/CommandTypes';
import {PAYMENT_TERM_ENUM} from '../../../../src/aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';
import {EventsEnum} from '../../../../src/Events';

describe('InheritPaymentTermClientLinkCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test credit on payload', async () => {
      const command: InheritPaymentTermClientLinkCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_CLIENT_LINK,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new InheritPaymentTermClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
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
      const command: InheritPaymentTermClientLinkCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_CLIENT_LINK,
        data: {
          term: PAYMENT_TERM_ENUM.PAY_IN_ADVANCE
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new InheritPaymentTermClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test null on payload when aggregate is not empty', async () => {
      const command: InheritPaymentTermClientLinkCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_CLIENT_LINK,
        data: {
          term: null
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new InheritPaymentTermClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test null on payload when aggregate is empty', async () => {
      const command: InheritPaymentTermClientLinkCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.INHERIT_PAYMENT_TERM_CLIENT_LINK,
        data: {
          term: null
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(0);
      repository.save.resolves();
      const handler = new InheritPaymentTermClientLinkCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.not.have.been.called;
    });
  });
});
