import {assert} from 'chai';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../src/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../src/Agency/AgencyRepository';
import {AddAgencyConsultantRoleCommandHandler} from '../../../src/Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum, AgencyEventEnum} from '../../../src/Agency/types';
import {AddAgencyConsultantRoleCommandDataInterface} from '../../../src/Agency/types/CommandDataTypes';

describe('AddAgencyConsultantRoleCommandHandler', () => {
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const commandData = {
        _id: 'some-id',
        name: 'some name',
        description: 'description',
        max_consultants: 2
      } as AddAgencyConsultantRoleCommandDataInterface;
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(100);
      aggregate.getId.returns({agency_id: agencyId});
      agencyRepository.save.resolves();
      const handler = new AddAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(handler.commandType, AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE, 'Expected command type to match');
      await handler.execute(agencyId, commandData);

      assert.deepEqual(
        agencyRepository.save.getCall(0).args[0],
        [
          {
            type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ADDED,
            aggregate_id: {agency_id: agencyId},
            data: {
              _id: 'some-id',
              name: 'some name',
              description: 'description',
              max_consultants: 2
            },
            sequence_id: 101
          },
          {
            type: AgencyEventEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
            aggregate_id: {agency_id: agencyId},
            data: {
              _id: 'some-id'
            },
            sequence_id: 102
          }
        ],
        'Expected events to be saved'
      );
    });
  });
});
