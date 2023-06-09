import {assert} from 'chai';
import {EventsEnum} from '../../../../src/Events';
import {stubConstructor} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {UnlinkAgencyClientCommandHandler} from '../../../../src/aggregates/AgencyClient/command-handlers/UnlinkAgencyClientCommandHandler';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {UnlinkAgencyClientCommandInterface} from '../../../../src/aggregates/AgencyClient/types/CommandTypes';

describe('UnlinkAgencyClientCommandHandler', function () {
  const agencyId = '5799b72e8aaf4a18b71106b4';
  const clientId = '6141d9cb9fb4b44d53469146';
  const aggregateId = {
    agency_id: agencyId,
    client_id: clientId
  };
  const commandData = {
    client_type: 'site',
    organisation_id: 'string 1',
    site_id: 'string 2'
  };
  const command: UnlinkAgencyClientCommandInterface = {
    aggregateId: {
      agency_id: agencyId,
      client_id: clientId
    },
    type: AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT,
    data: commandData
  };
  const expectedEvents = [
    {
      type: EventsEnum.AGENCY_CLIENT_UNLINKED,
      aggregate_id: aggregateId,
      data: commandData,
      sequence_id: 2
    }
  ];

  describe('execute()', function () {
    it('test that correct events are stored when agency client is already linked', async function () {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(true);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);

      const handler = new UnlinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      assert.equal(handler.commandType, AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT, 'Expected command type to match');
      await handler.execute(command);

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });

    it('test that correct events are stored when aggregate last id is 0', async function () {
      const expectedEvents = [
        {
          type: EventsEnum.AGENCY_CLIENT_UNLINKED,
          aggregate_id: aggregateId,
          data: commandData,
          sequence_id: 1
        }
      ];
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(false);
      agencyClientAggregateStub.getLastSequenceId.returns(0);
      agencyClientAggregateStub.getId.returns(aggregateId);

      const handler = new UnlinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      assert.equal(handler.commandType, AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT, 'Expected command type to match');
      await handler.execute(command);

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });

    it('test that no events are stored when client is not linked and last event id is 0', async function () {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(false);
      agencyClientAggregateStub.getLastSequenceId.returns(1);

      const handler = new UnlinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      await handler.execute(command);

      agencyClientRepositoryStub.save.should.not.have.been.called;
    });

    it('should throw an error when the call to retrieve the aggregate fails', async function () {
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.rejects(new Error('test error'));

      const handler = new UnlinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      await handler.execute(command).should.be.rejectedWith(Error, 'test error');
    });

    it('should throw an error when the save operation fails', async function () {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(true);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      agencyClientRepositoryStub.save.rejects(new Error('blah error'));

      const handler = new UnlinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      await handler.execute(command).should.be.rejectedWith(Error, 'blah error');

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });
  });
});
