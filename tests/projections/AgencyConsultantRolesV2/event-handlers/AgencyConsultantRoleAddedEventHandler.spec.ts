import sinon from 'ts-sinon';
import {EventsEnum} from '../../../../src/Events';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {AgencyConsultantRoleAddedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleAddedEventHandler';
import {AgencyConsultantRolesProjectionV2} from '../../../../src/models/AgencyConsultantRolesProjectionV2';

describe('AgencyConsultantRoleAddedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('handle()', () => {
    const agencyId = '5b16b824e8a73a752c42d848';
    const createdAt = '2022-06-30T10:27:35.464Z';
    const updatedAt = '2022-06-30T10:27:35.464Z';
    const event: any = {
      _id: '62bd7a978f7eab2e466a0c18',
      type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
      aggregate_id: {agency_id: agencyId},
      data: {
        _id: '62bc58ad371fecc5c10a2614',
        name: 'test',
        description: 'test',
        max_consultants: 2
      },
      sequence_id: 23,
      meta_data: {user_id: '1234567890'},
      correlation_id: '123',
      created_at: createdAt,
      updated_at: updatedAt
    };

    const payload = {
      agency_id: event.aggregate_id.agency_id,
      _id: event.data._id,
      name: event.data.name,
      description: event.data.description,
      max_consultants: event.data.max_consultants
    };

    it('should create agency consultant role record', async () => {
      const handler = new AgencyConsultantRoleAddedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      const saveStub = sinon.stub(AgencyConsultantRolesProjectionV2, 'create');

      await handler.handle(event);
      saveStub.should.have.been.calledOnceWith(payload);
    });

    it('should throw an error when the create operation fails', async () => {
      const handler = new AgencyConsultantRoleAddedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));
      const saveStub = sinon.stub(AgencyConsultantRolesProjectionV2, 'create');

      saveStub.rejects(new Error('blah error'));
      await handler.handle(event).should.be.rejectedWith(Error, 'blah error');
      saveStub.should.have.been.calledOnceWith(payload);
    });
  });
});
