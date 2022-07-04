import sinon, {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {EventsEnum} from '../../../../src/Events';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {AgencyClientsProjectionV2} from '../../../../src/models/AgencyClientsProjectionV2';
import {AgencyClientSyncedEventHandler} from '../../../../src/projections/AgencyClientsV2/event-handlers/AgencyClientSyncedEventHandler';

describe('AgencyClientConsultantAssignedEventHandler', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('handle()', () => {
    const agencyId = '60126eb559f35a4f3c34ff07';
    const clientId = '60126eb559f35a4f3c34ff06';
    const orgId = '61b8991abfb74a7157c6d88f';
    const event: any = {
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
    const criteria = {
      agency_id: agencyId,
      client_id: clientId,
      organisation_id: orgId
    };
    const data = {
      linked: false,
      client_type: 'site'
    };
    const upsert = {
      upsert: true
    };

    it('should create agency client Synced record for client_type site', async () => {
      const handler = new AgencyClientSyncedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      const saveStub = sinon.stub(AgencyClientsProjectionV2, 'findOneAndUpdate');

      await handler.handle(event);
      saveStub.should.have.been.calledOnceWith(criteria, data, upsert);
    });

    it('should create agency client Synced record for client_type organisation', async () => {
      const handler = new AgencyClientSyncedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      event.data.client_type = 'organisation';
      data.client_type = 'organisation';
      const saveStub = sinon.stub(AgencyClientsProjectionV2, 'findOneAndUpdate');

      await handler.handle(event);
      saveStub.should.have.been.calledOnceWith(criteria, data, upsert);
    });

    it('should throw an error when the findOneAndUpdate operation fails', async () => {
      const handler = new AgencyClientSyncedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));
      const findUpdateStub = sinon.stub(AgencyClientsProjectionV2, 'findOneAndUpdate');

      findUpdateStub.rejects(new Error('blah error'));
      await handler.handle(event).should.be.rejectedWith(Error, 'blah error');
      findUpdateStub.should.have.been.calledOnceWith(criteria, data, upsert);
    });
  });
});
