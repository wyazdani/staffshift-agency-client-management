import sinon, {stubConstructor} from 'ts-sinon';
import {assert} from 'chai';
import {EventsEnum} from '../../../../src/Events';
import {TestUtilsLogger} from '../../../tools/TestUtilsLogger';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';
import {AgencyConsultantRoleAddedEventHandler} from '../../../../src/projections/AgencyConsultantRolesV2/event-handlers/AgencyConsultantRoleAddedEventHandler';
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

    it.only('should update agency consultant role record', async () => {
      const handler = new AgencyConsultantRoleDetailsUpdatedEventHandler(TestUtilsLogger.getLogger(sinon.spy()));

      const updateOne = sinon.stub(AgencyConsultantRolesProjectionV2.prototype, 'updateOne');

      await handler.handle(event);
      updateOne.should.have.been.calledWith(
        {
          _id: event.data._id
        },
        {
          $set: {
            _id: event.data._id,
            name: 'test',
            description: 'test',
            max_consultants: 2
          }
        }
      );
    });
  });
});
