import sinon, {stubInterface} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {CommandBus} from '../../../../src/aggregates/CommandBus';
import {FinancialHoldAggregate} from '../../../../src/aggregates/FinancialHold/FinancialHoldAggregate';
import {FinancialHoldRepository} from '../../../../src/aggregates/FinancialHold/FinancialHoldRepository';
import {FinancialHoldCommandEnum} from '../../../../src/aggregates/FinancialHold/types';
import {FinancialHoldAgencyClientLinkPropagator} from '../../../../src/event-store-listeners/FinancialHoldAgencyClientLink/event-handlers/FinancialHoldAgencyClientLinkPropagator';
import {EventRepository} from '../../../../src/EventRepository';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';

describe('FinancialHoldAgencyClientLinkPropagator', () => {
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
      const propagator = new FinancialHoldAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'organisation'});
    });

    it('Test if client type is site, it loads org aggregate', async () => {
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const financialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .resolves(financialHoldAggregate);

      financialHoldAggregate.getFinancialHold.returns(true);
      financialHoldAggregate.getNote.returns('oops');
      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new FinancialHoldAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'site', organisation_id: orgId});
      getFinancialHoldAggregate.should.have.been.calledOnceWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      financialHoldAggregate.getFinancialHold.should.have.been.calledOnce;
      financialHoldAggregate.getNote.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'financial_hold',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: true,
          note: 'oops'
        }
      });
    });

    it('Test if client type is ward, it sets financial hold from site aggregate if site financial hold is still valid', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const financialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .resolves(financialHoldAggregate);

      financialHoldAggregate.getFinancialHold.returns(true);
      financialHoldAggregate.getNote.returns('oops');
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(new Date(0));
      financialHoldAggregate.getLastEventDate.returns(new Date());

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new FinancialHoldAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.should.have.been.calledOnceWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      financialHoldAggregate.getFinancialHold.should.have.been.calledOnce;
      financialHoldAggregate.getNote.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'financial_hold',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: true,
          note: 'oops'
        }
      });
    });

    it('Test if client type is ward and site is linked after site financial hold last event then it sets financial hold from org aggregate,', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const siteFinancialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const orgFinancialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .onFirstCall()
        .resolves(siteFinancialHoldAggregate)
        .onSecondCall()
        .resolves(orgFinancialHoldAggregate);

      orgFinancialHoldAggregate.getFinancialHold.returns(true);
      orgFinancialHoldAggregate.getNote.returns('oops');
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(new Date());
      siteFinancialHoldAggregate.getLastEventDate.returns(new Date(0));

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new FinancialHoldAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.getCall(0).should.have.been.calledWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.getCall(1).should.have.been.calledWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      siteFinancialHoldAggregate.getFinancialHold.should.not.have.been.called;
      orgFinancialHoldAggregate.getFinancialHold.should.have.been.calledOnce;
      siteFinancialHoldAggregate.getNote.should.not.have.been.called;
      orgFinancialHoldAggregate.getNote.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'financial_hold',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: true,
          note: 'oops'
        }
      });
    });

    it('Test if client type is ward and site agency client aggregate is empty then it sets financial hold from org aggregate,', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const siteFinancialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const orgFinancialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .onFirstCall()
        .resolves(siteFinancialHoldAggregate)
        .onSecondCall()
        .resolves(orgFinancialHoldAggregate);

      orgFinancialHoldAggregate.getFinancialHold.returns(true);
      orgFinancialHoldAggregate.getNote.returns('oops');
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(null);
      siteFinancialHoldAggregate.getLastEventDate.returns(new Date());

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new FinancialHoldAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.getCall(0).should.have.been.calledWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.getCall(1).should.have.been.calledWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      siteFinancialHoldAggregate.getFinancialHold.should.not.have.been.called;
      orgFinancialHoldAggregate.getFinancialHold.should.have.been.calledOnce;
      siteFinancialHoldAggregate.getNote.should.not.have.been.called;
      orgFinancialHoldAggregate.getNote.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'financial_hold',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: true,
          note: 'oops'
        }
      });
    });

    it('Test if client type is ward and site financial hold aggregate is empty then it sets financial hold from org aggregate,', async () => {
      const siteId = 'site id';
      const eventRepository = stubInterface<EventRepository>();
      const logger = TestUtilsLogger.getLogger(sinon.spy());
      const siteFinancialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const orgFinancialHoldAggregate = stubInterface<FinancialHoldAggregate>();
      const getFinancialHoldAggregate = sinon
        .stub(FinancialHoldRepository.prototype, 'getAggregate')
        .onFirstCall()
        .resolves(siteFinancialHoldAggregate)
        .onSecondCall()
        .resolves(orgFinancialHoldAggregate);

      orgFinancialHoldAggregate.getFinancialHold.returns(true);
      orgFinancialHoldAggregate.getNote.returns('oops');
      const siteAgencyClientAggregate = stubInterface<AgencyClientAggregate>();
      const getAgencyClientAggregate = sinon
        .stub(AgencyClientRepository.prototype, 'getAggregate')
        .resolves(siteAgencyClientAggregate);

      siteAgencyClientAggregate.getLinkedDate.returns(new Date());
      siteFinancialHoldAggregate.getLastEventDate.returns(null);

      const execCommand = sinon.stub(CommandBus.prototype, 'execute').resolves();
      const propagator = new FinancialHoldAgencyClientLinkPropagator(logger, eventRepository);

      await propagator.propagate(aggregateId, {client_type: 'ward', organisation_id: orgId, site_id: siteId});
      getAgencyClientAggregate.should.have.been.calledOnceWith({
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.getCall(0).should.have.been.calledWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: siteId
      });
      getFinancialHoldAggregate.getCall(1).should.have.been.calledWith({
        name: 'financial_hold',
        agency_id: aggregateId.agency_id,
        client_id: orgId
      });
      siteFinancialHoldAggregate.getFinancialHold.should.not.have.been.called;
      orgFinancialHoldAggregate.getFinancialHold.should.have.been.calledOnce;
      siteFinancialHoldAggregate.getNote.should.not.have.been.called;
      orgFinancialHoldAggregate.getNote.should.have.been.calledOnce;
      execCommand.should.have.been.calledOnceWith({
        aggregateId: {
          name: 'financial_hold',
          agency_id: aggregateId.agency_id,
          client_id: aggregateId.client_id
        },
        type: FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK,
        data: {
          financial_hold: true,
          note: 'oops'
        }
      });
    });
  });
});
