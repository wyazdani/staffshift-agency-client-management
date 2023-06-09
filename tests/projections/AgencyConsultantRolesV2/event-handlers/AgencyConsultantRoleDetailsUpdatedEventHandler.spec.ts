import sinon from 'ts-sinon';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {AgencyConsultantRolesProjectionV2} from '../../../../src/models/AgencyConsultantRolesProjectionV2';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';

describe('AgencyConsultantRoleDetailsUpdatedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('handle()', () => {
    const agencyId = '5b16b824e8a73a752c42d848';
    const createdAt = '2022-06-30T10:27:35.464Z';
    const updatedAt = '2022-06-30T10:27:35.464Z';
    const event: any = {
      _id: '62bd7a978f7eab2e466a0c18',
      type: 'event_type',
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

    const query = {
      _id: event.data._id,
      agency_id: agencyId
    };
    const payload = {
      $set: {
        _id: event.data._id,
        name: event.data.name,
        description: event.data.description,
        max_consultants: event.data.max_consultants
      }
    };

    it('should update agency consultant role record', async () => {
      const handler = new AgencyConsultantRoleDetailsUpdatedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      const updateOne = sinon.stub(AgencyConsultantRolesProjectionV2, 'updateOne');

      await handler.handle(event);
      updateOne.should.have.been.calledOnceWith(query, payload);
    });

    it('should throw an error when the updateOne operation fails', async () => {
      const handler = new AgencyConsultantRoleDetailsUpdatedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      const updateOne = sinon.stub(AgencyConsultantRolesProjectionV2, 'updateOne');

      updateOne.rejects(new Error('blah error'));
      await handler.handle(event).should.be.rejectedWith(Error, 'blah error');
      updateOne.should.have.been.calledOnceWith(query, payload);
    });
  });
});
