import sinon from 'ts-sinon';
import {EventsEnum} from '../../../src/Events';
import {AgencyConsultantRolesProjectionV2} from '../../../src/models/AgencyConsultantRolesProjectionV2';
import AgencyConsultantRolesProjector from '../../../src/projections/AgencyConsultantRolesV2/AgencyConsultantRolesProjector';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';
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
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      create.should.not.have.been.called;
      updateOne.should.not.have.been.called;
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

      create.resolves();
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      create.should.have.been.calledWith({
        agency_id: event.aggregate_id.agency_id,
        name: event.data.name,
        description: event.data.description,
        max_consultants: event.data.max_consultants,
        _id: event.data._id
      });
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

      create.rejects({code: MONGO_ERROR_CODES.DUPLICATE_KEY});
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      create.should.have.been.calledWith({
        agency_id: event.aggregate_id.agency_id,
        name: event.data.name,
        description: event.data.description,
        max_consultants: event.data.max_consultants,
        _id: event.data._id
      });
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

      create.rejects(error);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event).should.have.been.rejectedWith(error);
      create.should.have.been.calledWith({
        agency_id: event.aggregate_id.agency_id,
        name: event.data.name,
        description: event.data.description,
        max_consultants: event.data.max_consultants,
        _id: event.data._id
      });
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

      updateOne.resolves();
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      updateOne.should.have.been.calledOnceWith(
        {_id: consultantRoleId, agency_id: agencyId},
        {
          $set: {status: 'enabled'}
        },
        {}
      );
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

      updateOne.resolves();
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      updateOne.should.have.been.calledOnceWith(
        {_id: consultantRoleId, agency_id: agencyId},
        {
          $set: {status: 'disabled'}
        },
        {}
      );
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

      updateOne.resolves();
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event);
      updateOne.should.have.been.calledOnceWith(
        {_id: consultantRoleId, agency_id: agencyId},
        {
          $set: event.data
        },
        {}
      );
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

      updateOne.rejects(error);
      const projector = new AgencyConsultantRolesProjector();

      await projector.project(TestUtilsLogger.getLogger(sinon.spy()), event).should.have.been.rejectedWith(error);
      updateOne.should.have.been.calledOnceWith(
        {_id: consultantRoleId, agency_id: agencyId},
        {
          $set: event.data
        },
        {}
      );
    });
  });
});
