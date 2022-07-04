import {LoggerContext} from 'a24-logzio-winston';
import sinon from 'sinon';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {stubConstructor, stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {AgencyClientsProjectionV2} from '../../../src/models/AgencyClientsProjectionV2';
import AgencyClientsProjector from '../../../src/projections/AgencyClientsV2/AgencyClientsProjector';
import {AgencyClientLinkedEventHandler} from '../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientLinkedEventHandler';
import {AgencyClientSyncedEventHandler} from '../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientSyncedEventHandler';
import {AgencyClientUnLinkedEventHandler} from '../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientUnLinkedEventHandler';
import {EventHandlerFactory} from '../../../src/projections/AgencyClientsV2/factories/EventHandlerFactory';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('projections/AgencyClients/Projector', () => {
  let logger: LoggerContext;
  const projector = new AgencyClientsProjector();

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
  });
  afterEach(() => sinon.restore());
  describe('project()', async () => {
    const events = [
      EventsEnum.AGENCY_CLIENT_LINKED,
      EventsEnum.AGENCY_CLIENT_UNLINKED,
      EventsEnum.AGENCY_CLIENT_SYNCED
    ];
    const agencyId = '60126eb559f35a4f3c34ff07';
    const clientId = '60126eb559f35a4f3c34ff06';
    const orgId = '61b8991abfb74a7157c6d88f';

    for (const eventType of events) {
      it(`Test ${eventType}`, async () => {
        const event: any = {
          type: eventType
        };
        const handler = stubInterface<EventHandlerInterface<EventStorePubSubModelInterface>>();

        handler.handle.resolves();
        const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);
        const logger = TestUtilsLogger.getLogger(sinon.spy());
        const projector = new AgencyClientsProjector();

        await projector.project(logger, event);
        getHandler.should.have.been.calledWith(event.type, logger);
        handler.handle.should.have.been.calledWith(event);
      });
    }

    it('test that unsupported event are consumed successfully', async () => {
      const event: any = {
        type: 'someRandomEvent'
      };
      const handlerStub = stubConstructor(AgencyClientLinkedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      await projector.project(logger, event);
      handlerStub.handle.should.not.have.been.called;
    });
    it('test that agency client record is updated correctly for AgencyClientLinked event', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CLIENT_LINKED,
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId
        },
        data: {
          linked: true,
          organisation_id: orgId,
          client_type: 'site'
        }
      };
      const handlerStub = stubConstructor(AgencyClientLinkedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      await projector.project(logger, event);

      handlerStub.handle.should.have.been.calledOnceWith(event);
    });
    it('test that agency client record is updated correctly for AgencyClientUnLinked event', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CLIENT_UNLINKED,
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId
        },
        data: {
          linked: false,
          organisation_id: orgId,
          client_type: 'site'
        }
      };
      const handlerStub = stubConstructor(AgencyClientUnLinkedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      await projector.project(logger, event);

      handlerStub.handle.should.have.been.calledWith(event);
    });

    it('test that agency client record is updated correctly for AgencyClientSynced event', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CLIENT_SYNCED,
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId
        },
        data: {
          linked: false,
          organisation_id: orgId,
          client_type: 'site'
        }
      };
      const handlerStub = stubConstructor(AgencyClientSyncedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      await projector.project(logger, event);

      handlerStub.handle.should.have.been.calledWith(event);
    });
  });
});
