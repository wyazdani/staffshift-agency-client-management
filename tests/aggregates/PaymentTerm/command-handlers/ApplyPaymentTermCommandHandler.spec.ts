import sinon, {stubInterface} from 'ts-sinon';
import {ApplyPaymentTermCommandHandler} from '../../../../src/aggregates/PaymentTerm/command-handlers';
import {PaymentTermAggregate} from '../../../../src/aggregates/PaymentTerm/PaymentTermAggregate';
import {PaymentTermRepository} from '../../../../src/aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermCommandEnum} from '../../../../src/aggregates/PaymentTerm/types';
import {ApplyPaymentTermCommandInterface} from '../../../../src/aggregates/PaymentTerm/types/CommandTypes';
import {PAYMENT_TERM_ENUM} from '../../../../src/aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';
import {EventsEnum} from '../../../../src/Events';

describe('ApplyPaymentTermCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario for credit', async () => {
      const command: ApplyPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });

    it('Test success scenario for pay_in_advance', async () => {
      const command: ApplyPaymentTermCommandInterface = {
        aggregateId: {
          name: 'payment_term',
          agency_id: agencyId,
          client_id: clientId
        },
        type: PaymentTermCommandEnum.APPLY_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.PAY_IN_ADVANCE
        }
      };
      const repository = stubInterface<PaymentTermRepository>();
      const aggregate = stubInterface<PaymentTermAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new ApplyPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED,
          aggregate_id: aggregate.getId(),
          data: {},
          sequence_id: 2
        }
      ]);
    });
  });
});
