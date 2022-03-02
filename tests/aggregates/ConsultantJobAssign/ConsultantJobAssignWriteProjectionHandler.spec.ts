import {ConsultantJobAssignWriteProjectionHandler} from '../../../src/aggregates/ConsultantJobAssign/ConsultantJobAssignWriteProjectionHandler';
import {EventsEnum} from '../../../src/Events';
import {EventStore} from '../../../src/models/EventStore';
import {assert} from 'chai';
import {AgencyConsultantRoleEnabledEventStoreDataInterface} from '../../../src/types/EventStoreDataTypes';

describe('ConsultantJobAssignWriteProjectionHandler', () => {
  describe('execute()', () => {
    const projectionHandler = new ConsultantJobAssignWriteProjectionHandler();

    it('Test throw error when event not found', () => {
      const aggregate: any = {
        last_sequence_id: 1
      };
      const eventData: AgencyConsultantRoleEnabledEventStoreDataInterface = {
        _id: 'oops'
      };
      const event = new EventStore({
        type: 'sample',
        aggregate_id: {},
        data: eventData,
        sequence_id: 1,
        meta_data: {},
        correlation_id: 1
      });

      assert.throw(
        () => projectionHandler.execute(EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED, aggregate, event),
        Error,
        `Event type not supported: ${EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED}`
      );
    });
  });
});
