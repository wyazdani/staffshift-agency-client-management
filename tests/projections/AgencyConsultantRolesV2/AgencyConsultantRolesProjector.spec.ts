import sinon, {stubConstructor, stubInterface} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {AgencyConsultantRolesProjectionV2} from '../../../src/models/AgencyConsultantRolesProjectionV2';
import AgencyConsultantRolesProjector from '../../../src/projections/AgencyConsultantRolesV2/AgencyConsultantRolesProjector';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';
import {AgencyConsultantRoleAddedEventHandler} from '../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleAddedEventHandler';
import {EventHandlerFactory} from '../../../src/projections/AgencyConsultantRolesV2/factories/EventHandlerFactory';
import {AgencyConsultantRoleEnabledEventHandler} from '../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleEnabledEventHandler';
import {AgencyConsultantRoleDisabledEventHandler} from '../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleDisabledEventHandler';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {EventStorePubSubModelInterface} from 'ss-eventstore/dist/declarations';
import {EventHandlerInterface} from '../../../src/types/EventHandlerInterface';

describe('AgencyConsultantRolesProjectorV2', () => {
  describe('project', () => {
    const events = [
      EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
      EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
      EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
      EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
    ];
    const agencyId = '60126eb559f35a4f3c34ff07';
    const consultantRoleId = '60126eb559f35a4f3c34ff06';

    afterEach(() => {
      sinon.restore();
    });
    it('Test unsupported event', async () => {
      const event: any = {
        type: 'oops'
      };
      const handlerStub = stubConstructor(AgencyConsultantRoleAddedEventHandler);
      const projector = new AgencyConsultantRolesProjector();

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.not.have.been.called;
    });

    for (const eventType of events) {
      it(`Test ${eventType}`, async () => {
        const event: any = {
          type: eventType,
          aggregate_id: {
            agency_id: agencyId
          },
          data: {
            name: 'some name',
            description: 'describe me',
            max_consultants: 1,
            _id: consultantRoleId
          }
        };
        const handler = stubInterface<EventHandlerInterface<EventStorePubSubModelInterface>>();

        handler.handle.resolves();
        const getHandler = sinon.stub(EventHandlerFactory, 'getHandler').returns(handler);
        const logger = TestUtilsLogger.getLogger(sinon.spy());
        const projector = new AgencyConsultantRolesProjector();

        await projector.project(logger, event);
        getHandler.should.have.been.calledWith(event.type, logger);
        handler.handle.should.have.been.calledWith(event);
      });
    }

    it('test AGENCY_CONSULTANT_ROLE_ADDED fails in unknown error', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
        aggregate_id: {
          agency_id: agencyId
        },
        data: {
          name: 'some name',
          description: 'describe me',
          max_consultants: 1,
          _id: consultantRoleId
        }
      };
      const error = new Error('sample');
      const handlerStub = stubConstructor(AgencyConsultantRoleAddedEventHandler);

      handlerStub.handle.rejects(error);
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event).should.have.been.rejectedWith(error);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });
  });
});
