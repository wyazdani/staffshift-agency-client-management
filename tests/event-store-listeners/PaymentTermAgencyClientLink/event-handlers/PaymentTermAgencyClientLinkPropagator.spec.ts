import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {CommandBus} from '../../../../src/aggregates/CommandBus';
import {PaymentTermAggregate} from '../../../../src/aggregates/PaymentTerm/PaymentTermAggregate';
import {PaymentTermRepository} from '../../../../src/aggregates/PaymentTerm/PaymentTermRepository';
import {PaymentTermCommandEnum} from '../../../../src/aggregates/PaymentTerm/types';
import {PAYMENT_TERM_ENUM} from '../../../../src/aggregates/PaymentTerm/types/PaymentTermAggregateRecordInterface';
import {PaymentTermAgencyClientLinkPropagator} from '../../../../src/event-store-listeners/PaymentTermAgencyClientLink/event-handlers/PaymentTermAgencyClientLinkPropagator';
import {EventRepository} from '../../../../src/EventRepository';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('PaymentTermAgencyClientLinkPropagator', () => {
  afterEach(() => sinon.restore());

  describe('propagate()', () => {
    const orgId = 'org id';
    const aggregateId = {
      agency_id: 'agency id',
      client_id: 'client id'
    };

    it('Test if client type is organisation, skip', async () => {
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const propagator = new PaymentTermAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'organisation'});
    });

    it('Test if client type is site, it loads org aggregate', async () => {
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const paymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const getPaymentTermAggregate = sinon
        .stub(PaymentTermRepository.prototype, 'getAggregate')
        .resolves(paymentTermAggregate);

      paymentTermAggregate.getPaymentTerm.returns(PAYMENT_TERM_ENUM.CREDIT);

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new PaymentTermAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'site', organisation_id: orgId});
      getPaymentTermAggregate.should.have.been.calledOnceWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      paymentTermAggregate.getPaymentTerm.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT,
          force: true
        }
      });
    });

    it('Test if client type is ward, it sets pay term from site aggregate if site pay term is still valid', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const paymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const getPaymentTermAggregate = sinon
        .stub(PaymentTermRepository.prototype, 'getAggregate')
        .resolves(paymentTermAggregate);

      paymentTermAggregate.getPaymentTerm.returns(PAYMENT_TERM_ENUM.CREDIT);
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(new Date(0));
      paymentTermAggregate.getLastEventDate.returns(new Date());

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new PaymentTermAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.should.have.been.calledOnceWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      paymentTermAggregate.getPaymentTerm.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT,
          force: true
        }
      });
    });

    it('Test if client type is ward and site is linked after site payment term last event then it sets pay term from org aggregate,', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const sitePaymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const orgPaymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const getPaymentTermAggregate = sinon
        .stub(PaymentTermRepository.prototype, 'getAggregate')
        .onFirstCall()
        .resolves(sitePaymentTermAggregate)
        .onSecondCall()
        .resolves(orgPaymentTermAggregate);

      orgPaymentTermAggregate.getPaymentTerm.returns(PAYMENT_TERM_ENUM.CREDIT);
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(new Date());
      sitePaymentTermAggregate.getLastEventDate.returns(new Date(0));

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new PaymentTermAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.getCall(0).should.have.been.calledWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.getCall(1).should.have.been.calledWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      sitePaymentTermAggregate.getPaymentTerm.should.not.have.been.called;
      orgPaymentTermAggregate.getPaymentTerm.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT,
          force: true
        }
      });
    });

    it('Test if client type is ward and site agency client aggregate is empty then it sets pay term from org aggregate,', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const sitePaymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const orgPaymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const getPaymentTermAggregate = sinon
        .stub(PaymentTermRepository.prototype, 'getAggregate')
        .onFirstCall()
        .resolves(sitePaymentTermAggregate)
        .onSecondCall()
        .resolves(orgPaymentTermAggregate);

      orgPaymentTermAggregate.getPaymentTerm.returns(PAYMENT_TERM_ENUM.CREDIT);
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(null);
      sitePaymentTermAggregate.getLastEventDate.returns(new Date());

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new PaymentTermAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.getCall(0).should.have.been.calledWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.getCall(1).should.have.been.calledWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      sitePaymentTermAggregate.getPaymentTerm.should.not.have.been.called;
      orgPaymentTermAggregate.getPaymentTerm.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT,
          force: true
        }
      });
    });

    it('Test if client type is ward and site payment term aggregate is empty then it sets pay term from org aggregate,', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const sitePaymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const orgPaymentTermAggregate = stubInterface<PaymentTermAggregate>();
      const getPaymentTermAggregate = sinon
        .stub(PaymentTermRepository.prototype, 'getAggregate')
        .onFirstCall()
        .resolves(sitePaymentTermAggregate)
        .onSecondCall()
        .resolves(orgPaymentTermAggregate);

      orgPaymentTermAggregate.getPaymentTerm.returns(PAYMENT_TERM_ENUM.CREDIT);
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(new Date());
      sitePaymentTermAggregate.getLastEventDate.returns(null);

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new PaymentTermAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.getCall(0).should.have.been.calledWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getPaymentTermAggregate.getCall(1).should.have.been.calledWith({
        name: 'payment_term',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      sitePaymentTermAggregate.getPaymentTerm.should.not.have.been.called;
      orgPaymentTermAggregate.getPaymentTerm.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'payment_term',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
        data: {
          term: PAYMENT_TERM_ENUM.CREDIT,
          force: true
        }
      });
    });
  });
});
