import sinon, {stubConstructor} from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import AgencyClientConsultantsProjector from '../../../src/projections/AgencyClientConsultantsV3/AgencyClientConsultantsProjector';
import {AgencyClientConsultantAssignedEventHandler} from '../../../src/projections/AgencyClientConsultantsV3/event-handlers/AgencyClientConsultantAssignedEventHandler';
import {EventHandlerFactory} from '../../../src/projections/AgencyClientConsultantsV3/factories/EventHandlerFactory';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';

describe('Test AgencyClientConsultantsProjectorV2', () => {
  describe('onEvent()', () => {
    afterEach(() => {
      sinon.restore();
    });
    it('Test AGENCY_CLIENT_CONSULTANT_ASSIGNED', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED
      };
      const handlerStub = stubConstructor(AgencyClientConsultantAssignedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyClientConsultantsProjector();

      await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });

    it('Test AGENCY_CLIENT_CONSULTANT_UNASSIGNED', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED
      };
      const handlerStub = stubConstructor(AgencyClientConsultantAssignedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyClientConsultantsProjector();

      await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });

    it('Test AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED', async () => {
      const event: any = {
        type: EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
      };
      const handlerStub = stubConstructor(AgencyClientConsultantAssignedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyClientConsultantsProjector();

      await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.have.been.calledOnceWith(event);
    });

    it('Test unknown event', async () => {
      const event: any = {
        type: 'oops'
      };
      const handlerStub = stubConstructor(AgencyClientConsultantAssignedEventHandler);

      handlerStub.handle.resolves();
      sinon.stub(EventHandlerFactory, 'getHandler').returns(handlerStub);
      const projector = new AgencyClientConsultantsProjector();

      await projector.onEvent(TestUtilsLogger.getLogger(sinon.spy()), event);
      handlerStub.handle.should.not.have.been.called;
    });
  });
});
