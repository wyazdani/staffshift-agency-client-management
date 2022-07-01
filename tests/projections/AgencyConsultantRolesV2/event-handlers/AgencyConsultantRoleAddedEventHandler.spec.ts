import sinon, {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {EventsEnum} from '../../../../src/Events';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
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

    it('should create agency consultant role record', async () => {
      const handler = new AgencyConsultantRoleAddedEventHandler(TestUtilsLogger.getLogger(sinon.spy()), event);
      const expectedRecord = {
        _id: event.data._id,
        name: event.data.name,
        description: event.data.description,
        max_consultants: event.data.max_consultants,
        created_at: createdAt,
        updated_at: updatedAt,
        __v: 0,
        status: 'enabled'
      };
      const saveStub = sinon.stub(AgencyConsultantRolesProjectionV2.prototype, 'save');

      saveStub.callsFake(() => {
        const data = saveStub.thisValues[0];

        assert.deepEqual(data.toJSON(), expectedRecord, 'Incorrect agency consultant role record saved');
        return Promise.resolve();
      });

      await handler.handle(event);
    });
  });
});
