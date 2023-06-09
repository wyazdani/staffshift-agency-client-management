import {assert} from 'chai';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {AddAgencyClientConsultantCommandHandler} from '../../../../src/aggregates/AgencyClient/command-handlers/AddAgencyClientConsultantCommandHandler';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {stubConstructor} from 'ts-sinon';
import {EventsEnum} from '../../../../src/Events';
import {AddAgencyClientConsultantCommandInterface} from '../../../../src/aggregates/AgencyClient/types/CommandTypes';

describe('AddAgencyClientConsultantCommandHandler', () => {
  describe('execute()', () => {
    const agencyId = '6141d9cb9fb4b44d53469145';
    const clientId = '6141d9cb9fb4b44d53469146';
    const aggregateId = {
      agency_id: agencyId,
      client_id: clientId
    };
    const commandData = {
      _id: 'some id',
      consultant_role_id: 'role id',
      consultant_id: 'consultant id'
    };
    const command: AddAgencyClientConsultantCommandInterface = {
      aggregateId: aggregateId,
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: commandData
    };
    const expectedEvents = [
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
        aggregate_id: aggregateId,
        data: commandData,
        sequence_id: 2
      }
    ];

    it('test that correct event is saved', async () => {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new AddAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.validateAddClientConsultant.resolves();
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command);

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });

    it('should throw an error when the save operation fails', async () => {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new AddAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.validateAddClientConsultant.resolves();
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      agencyClientRepositoryStub.save.rejects(new Error('blah error'));
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command).should.be.rejectedWith(Error, 'blah error');

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });

    it('should throw an error when the call to retrieve the aggregate fails', async () => {
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new AddAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.rejects(new Error('some error here'));
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command).should.be.rejectedWith(Error, 'some error here');

      assert.equal(agencyClientRepositoryStub.save.callCount, 0, 'no events should be saved');
    });
  });
});
