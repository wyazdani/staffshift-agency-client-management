import {assert} from 'chai';
import {stubConstructor} from 'ts-sinon';
import {AgencyAggregate} from '../../../../src/aggregates/Agency/AgencyAggregate';
import {AgencyRepository} from '../../../../src/aggregates/Agency/AgencyRepository';
import {AddAgencyConsultantRoleCommandHandler} from '../../../../src/aggregates/Agency/command-handlers/AddAgencyConsultantRoleCommandHandler';
import {AgencyCommandEnum} from '../../../../src/aggregates/Agency/types';
import {AddAgencyConsultantRoleCommandInterface} from '../../../../src/aggregates/Agency/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('AddAgencyConsultantRoleCommandHandler', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const command: AddAgencyConsultantRoleCommandInterface = {
      aggregateId: {
        name: 'agency',
        agency_id: agencyId
      },
      type: AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE,
      data: {
        _id: 'some-id',
        name: 'some name',
        description: 'description',
        max_consultants: 2
      }
    };

    it('Test correct events are persisted', async () => {
      const agencyRepository = stubConstructor(AgencyRepository);
      const aggregate = stubConstructor(AgencyAggregate);

      agencyRepository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(100);
      aggregate.getId.returns({name: 'agency', agency_id: agencyId});
      agencyRepository.save.resolves();
      const handler = new AddAgencyConsultantRoleCommandHandler(agencyRepository);

      assert.equal(handler.commandType, AgencyCommandEnum.ADD_AGENCY_CONSULTANT_ROLE, 'Expected command type to match');
      await handler.execute(command);
      agencyRepository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED,
          aggregate_id: {name: 'agency', agency_id: agencyId},
          data: {
            _id: 'some-id',
            name: 'some name',
            description: 'description',
            max_consultants: 2
          },
          sequence_id: 101
        },
        {
          type: EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED,
          aggregate_id: {name: 'agency', agency_id: agencyId},
          data: {
            _id: 'some-id'
          },
          sequence_id: 102
        }
      ]);
    });
  });
});
