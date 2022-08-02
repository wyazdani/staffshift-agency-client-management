import sinon from 'ts-sinon';
import {AgencyClientsProjectionV2} from '../../src/models/AgencyClientsProjectionV2';

describe('AgencyClientsProjectionV2', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('statics', () => {
    const agencyId = 'agency id';
    const organisationId = 'organisation id';
    const siteId = 'site id';
    const wardId = 'ward id';

    describe('getAllLinkedSites()', () => {
      it('Test runs the query', async () => {
        const records: any = [{sample: 'ok'}];
        const exec = sinon.stub().resolves(records);
        const find = sinon.stub(AgencyClientsProjectionV2, 'find').returns({exec} as any);
        const response = await AgencyClientsProjectionV2.getAllLinkedSites(agencyId, organisationId);

        response.should.deep.equal(records);
        find.should.have.been.calledOnceWith({
          agency_id: agencyId,
          organisation_id: organisationId,
          client_type: 'site',
          linked: true
        });
        exec.should.have.been.calledOnce;
      });
    });

    describe('getAllLinkedWards()', () => {
      it('Test runs the query', async () => {
        const records: any = [{sample: 'ok'}];
        const exec = sinon.stub().resolves(records);
        const find = sinon.stub(AgencyClientsProjectionV2, 'find').returns({exec} as any);
        const response = await AgencyClientsProjectionV2.getAllLinkedWards(agencyId, organisationId, siteId);

        response.should.deep.equal(records);
        find.should.have.been.calledOnceWith({
          agency_id: agencyId,
          organisation_id: organisationId,
          site_id: siteId,
          client_type: 'ward',
          linked: true
        });
        exec.should.have.been.calledOnce;
      });
    });

    describe('getEstimatedDescendantCount()', () => {
      it('Test for ward', async () => {
        const response = await AgencyClientsProjectionV2.getEstimatedDescendantCount(agencyId, organisationId, wardId, 'ward');

        response.should.equal(1);
      });

      it('Test for site', async () => {
        const exec = sinon.stub().resolves(2);
        const countDocuments = sinon.stub(AgencyClientsProjectionV2, 'countDocuments').returns({exec} as any);
        const response = await AgencyClientsProjectionV2.getEstimatedDescendantCount(agencyId, organisationId, siteId, 'site');

        response.should.equal(3);
        countDocuments.should.have.been.calledOnceWith({
          agency_id: agencyId,
          organisation_id: organisationId,
          site_id: siteId,
          linked: true
        });
        exec.should.have.been.calledOnce;
      });

      it('Test for organisation', async () => {
        const exec = sinon.stub().resolves(2);
        const countDocuments = sinon.stub(AgencyClientsProjectionV2, 'countDocuments').returns({exec} as any);
        const response = await AgencyClientsProjectionV2.getEstimatedDescendantCount(
          agencyId,
          organisationId,
          siteId,
          'organisation'
        );

        response.should.equal(3);
        countDocuments.should.have.been.calledOnceWith({
          agency_id: agencyId,
          organisation_id: organisationId,
          linked: true
        });
        exec.should.have.been.calledOnce;
      });
    });
  });
});
