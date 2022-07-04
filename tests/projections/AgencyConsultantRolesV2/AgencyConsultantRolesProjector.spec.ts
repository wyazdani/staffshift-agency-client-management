import sinon, {stubConstructor} from 'ts-sinon';
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

describe('AgencyConsultantRolesProjectorV2', () => {
  describe('project', () => {
    let create: any;
    let updateOne: any;
    const agencyId = '60126eb559f35a4f3c34ff07';
    const consultantRoleId = '60126eb559f35a4f3c34ff06';

    beforeEach(() => {
      create = sinon.stub(AgencyConsultantRolesProjectionV2, 'create');
      updateOne = sinon.stub(AgencyConsultantRolesProjectionV2, 'updateOne');
    });
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

    it('Test AGENCY_CONSULTANT_ROLE_ADDED', async () => {
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
      const handlerStub = stubConstructor(AgencyConsultantRoleAddedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });

    it('test AGENCY_CONSULTANT_ROLE_ADDED when save operation fails with duplicate key error ', async () => {
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
      const handlerStub = stubConstructor(AgencyConsultantRoleAddedEventHandler);

      handlerStub.handle.rejects({code: MONGO_ERROR_CODES.DUPLICATE_KEY});
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });

    it('test AGENCY_CONSULTANT_ROLE_ADDED when save operation fails in unknown error', async () => {
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

    it('Test AGENCY_CONSULTANT_ROLE_ENABLED', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
        aggregate_id: {
          agency_id: agencyId
        },
        data: {
          _id: consultantRoleId
        }
      };
      const handlerStub = stubConstructor(AgencyConsultantRoleEnabledEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });

    it('Test AGENCY_CONSULTANT_ROLE_DISABLED', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED,
        aggregate_id: {
          agency_id: agencyId
        },
        data: {
          _id: consultantRoleId
        }
      };

      const handlerStub = stubConstructor(AgencyConsultantRoleDisabledEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });
    it('Test AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
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

      const handlerStub = stubConstructor(AgencyConsultantRoleDetailsUpdatedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });
    it('Test AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED failure scenario', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
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
      const error = new Error('sample error');
      const handlerStub = stubConstructor(AgencyConsultantRoleDetailsUpdatedEventHandler);

      handlerStub.handle.rejects(error);
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event).should.have.been.rejectedWith(error);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });
  });
});
