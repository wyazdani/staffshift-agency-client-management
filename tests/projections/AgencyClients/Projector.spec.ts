import {LoggerContext} from 'a24-logzio-winston';
import sinon from 'sinon';
import {EventsEnum} from '../../../src/Events';
import {AgencyClientsPubSubProjection} from '../../../src/models/AgencyClientsPubSubProjection';
import {TestUtilsLogger} from '../../tools/TestUtilsLogger';
/*eslint-disable*/
const projector = require('../../../src/projections/AgencyClients/Projector');
/*eslint-enable*/

describe('projections/AgencyClients/Projector', () => {
  let logger: LoggerContext;
  let findOneAndUpdate: any;

  beforeEach(() => {
    logger = TestUtilsLogger.getLogger(sinon.spy());
    findOneAndUpdate = sinon.stub(AgencyClientsPubSubProjection, 'findOneAndUpdate');
  });
  afterEach(() => sinon.restore());
  describe('project()', async () => {
    const agencyId = '60126eb559f35a4f3c34ff07';
    const clientId = '60126eb559f35a4f3c34ff06';
    const orgId = '61b8991abfb74a7157c6d88f';

    it('test that unsupported event are consumed successfully', async () => {
      const event = {
        type: 'someRandomEvent'
      };

      await projector(logger, event);
      findOneAndUpdate.should.not.have.been.called;
    });
    it('test that agency client record is updated correctly for AgencyClientLinked event', async () => {
      const event = {
        type: EventsEnum.AGENCY_CLIENT_LINKED,
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId
        },
        data: {
          linked: true,
          organisation_id: orgId,
          client_type: 'site'
        }
      };

      await projector(logger, event);
      const expectedFilter = {
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: orgId
      };
      const expectedUpdate = {
        client_type: 'site',
        linked: true
      };
      const expectedOpts = {upsert: true};

      findOneAndUpdate.should.have.been.calledWith(expectedFilter, expectedUpdate, expectedOpts);
    });
    it('test that agency client record is updated correctly for AgencyClientUnLinked event', async () => {
      const event = {
        type: EventsEnum.AGENCY_CLIENT_UNLINKED,
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId
        },
        data: {
          linked: false,
          organisation_id: orgId,
          client_type: 'site'
        }
      };

      await projector(logger, event);

      const expectedFilter = {
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: orgId
      };
      const expectedUpdate = {
        client_type: 'site',
        linked: false
      };
      const expectedOpts = {upsert: true};

      findOneAndUpdate.should.have.been.calledWith(expectedFilter, expectedUpdate, expectedOpts);
    });

    it('test that agency client record is updated correctly for AgencyClientSynced event', async () => {
      const event = {
        type: EventsEnum.AGENCY_CLIENT_SYNCED,
        aggregate_id: {
          agency_id: agencyId,
          client_id: clientId
        },
        data: {
          linked: false,
          organisation_id: orgId,
          client_type: 'site'
        }
      };

      await projector(logger, event);

      const expectedFilter = {
        agency_id: agencyId,
        client_id: clientId,
        organisation_id: orgId
      };
      const expectedUpdate = {
        client_type: 'site',
        linked: false
      };
      const expectedOpts = {upsert: true};

      findOneAndUpdate.should.have.been.calledWith(expectedFilter, expectedUpdate, expectedOpts);
    });
  });
});
