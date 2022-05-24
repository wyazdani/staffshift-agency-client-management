import sinon from 'ts-sinon';
import {ClientAssignments} from '../../../../src/BulkProcessManager/processes/ConsultantUnassignProcess/ClientAssignments';
import {AgencyClientConsultantsProjectionV3} from '../../../../src/models/AgencyClientConsultantsProjectionV3';

describe('ClientAssignments class', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('getClientAssignments()', () => {
    it('Test when event contains client ids and consultant role id', async () => {
      const response = [{sample: 'ok'}];
      const exec = sinon.stub().resolves(response);
      const find = sinon.stub(AgencyClientConsultantsProjectionV3, 'find').returns({
        lean: sinon.stub().returns({
          exec
        })
      } as any);

      const event: any = {
        aggregate_id: {
          agency_id: 'agency id'
        },
        data: {
          consultant_id: 'consultant id',
          client_ids: ['A', 'B'],
          consultant_role_id: 'C'
        }
      };
      const clientAssignment = ClientAssignments.createInstance(event);

      const assignments = await clientAssignment.getClientAssignments();

      assignments.should.deep.equal(response);
      find.should.have.been.calledWith(
        {
          consultant_id: 'consultant id',
          agency_id: 'agency id',
          client_id: {
            $in: ['A', 'B']
          },
          consultant_role_id: 'C'
        },
        {
          _id: 1,
          client_id: 1,
          consultant_id: 1,
          consultant_role_id: 1,
          agency_id: 1
        }
      );
      exec.should.have.been.calledOnce;
    });

    it('Test when event does not contain client ids and consultant role id', async () => {
      const response = [{sample: 'ok'}];
      const exec = sinon.stub().resolves(response);
      const find = sinon.stub(AgencyClientConsultantsProjectionV3, 'find').returns({
        lean: sinon.stub().returns({
          exec
        })
      } as any);

      const event: any = {
        aggregate_id: {
          agency_id: 'agency id'
        },
        data: {
          consultant_id: 'consultant id'
        }
      };
      const clientAssignment = ClientAssignments.createInstance(event);

      const assignments = await clientAssignment.getClientAssignments();

      assignments.should.deep.equal(response);
      find.should.have.been.calledWith(
        {
          consultant_id: 'consultant id',
          agency_id: 'agency id'
        },
        {
          _id: 1,
          client_id: 1,
          consultant_id: 1,
          consultant_role_id: 1,
          agency_id: 1
        }
      );
      exec.should.have.been.calledOnce;
    });
  });

  describe('getEstimatedCount()', () => {
    it('Test counting the documents', async () => {
      const exec = sinon.stub().returns(2);
      const count = sinon.stub(AgencyClientConsultantsProjectionV3, 'count').returns({
        exec
      } as any);

      const event: any = {
        aggregate_id: {
          agency_id: 'agency id'
        },
        data: {
          consultant_id: 'consultant id',
          client_ids: ['A', 'B'],
          consultant_role_id: 'C'
        }
      };
      const clientAssignment = ClientAssignments.createInstance(event);

      const response = await clientAssignment.getEstimatedCount();

      response.should.equal(2);
      count.should.have.been.calledWith({
        consultant_id: 'consultant id',
        agency_id: 'agency id',
        client_id: {
          $in: ['A', 'B']
        },
        consultant_role_id: 'C'
      });
      exec.should.have.been.calledOnce;
    });
  });
});
