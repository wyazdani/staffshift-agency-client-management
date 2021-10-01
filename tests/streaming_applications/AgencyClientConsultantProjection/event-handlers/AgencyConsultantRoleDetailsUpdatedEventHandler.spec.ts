import sinon from 'ts-sinon';
import {AgencyClientConsultantsProjection} from '../../../../src/models/AgencyClientConsultantsProjection';
import {AgencyConsultantRoleDetailsUpdatedEventHandler} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/event-handlers/AgencyConsultantRoleDetailsUpdatedEventHandler';
import {AgencyEventEnum} from '../../../../src/Agency/types';

describe('AgencyConsultantRoleDetailsUpdatedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('handle()', () => {
    const agencyId = '5b16b824e8a73a752c42d848';
    const clientId = '6155c39a2dff5a83f7b7bc6c';
    const event = {
      type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
      sequence_id: 1,
      aggregate_id: {
        agency_id: agencyId,
        client_id: clientId
      },
      data: {
        _id: '6155dbf647852e2b3852ef29',
        name: 'new name'
      }
    };
    const expectedFilter = {consultant_role_id: event.data._id};
    const expectedUpdate = {$set: {consultant_role_name: event.data.name}};

    it('should delete the record with correct filter', async () => {
      const handler = new AgencyConsultantRoleDetailsUpdatedEventHandler();
      const updateManyStub = sinon.stub(AgencyClientConsultantsProjection, 'updateMany');

      updateManyStub.resolves();
      await handler.handle(event);
      updateManyStub.should.have.been.calledOnceWith(expectedFilter, expectedUpdate);
    });

    it('should throw an error when the updateMany operation fails', async () => {
      const handler = new AgencyConsultantRoleDetailsUpdatedEventHandler();
      const updateManyStub = sinon.stub(AgencyClientConsultantsProjection, 'updateMany');

      updateManyStub.rejects(new Error('blah error'));
      await handler.handle(event).should.be.rejectedWith(Error, 'blah error');
      updateManyStub.should.have.been.calledOnceWith(expectedFilter, expectedUpdate);
    });
  });
});
