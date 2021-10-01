import sinon from 'ts-sinon';
import {AgencyClientConsultantUnassignedEventHandler} from '../../../../src/streaming_applications/AgencyClientConsultantProjection/event-handlers/AgencyClientConsultantUnassignedEventHandler';
import {AgencyClientConsultantsProjection} from '../../../../src/models/AgencyClientConsultantsProjection';
import {AgencyClientEventEnum} from '../../../../src/AgencyClient/types';

describe('AgencyClientConsultantUnassignedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('handle()', () => {
    const agencyId = '5b16b824e8a73a752c42d848';
    const clientId = '6155c39a2dff5a83f7b7bc6c';
    const event = {
      type: AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
      sequence_id: 1,
      aggregate_id: {
        agency_id: agencyId,
        client_id: clientId
      },
      data: {
        _id: '6155dbf647852e2b3852ef29'
      }
    };
    const expectedFilter = {_id: event.data._id};

    it('should delete the record with correct filter', async () => {
      const handler = new AgencyClientConsultantUnassignedEventHandler();
      const deleteOneStub = sinon.stub(AgencyClientConsultantsProjection, 'deleteOne');

      deleteOneStub.resolves();
      await handler.handle(event);
      deleteOneStub.should.have.been.calledOnceWith(expectedFilter);
    });

    it('should throw an error when the deleteOne operation fails', async () => {
      const handler = new AgencyClientConsultantUnassignedEventHandler();
      const deleteOneStub = sinon.stub(AgencyClientConsultantsProjection, 'deleteOne');

      deleteOneStub.rejects(new Error('blah error'));
      await handler.handle(event).should.be.rejectedWith(Error, 'blah error');
      deleteOneStub.should.have.been.calledOnceWith(expectedFilter);
    });
  });
});
