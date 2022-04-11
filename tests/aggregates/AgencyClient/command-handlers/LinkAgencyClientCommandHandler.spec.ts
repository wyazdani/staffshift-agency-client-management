import {assert} from 'chai';
import {stubConstructor} from 'ts-sinon';
import {EventsEnum} from '../../../../src/Events';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {LinkAgencyClientCommandHandler} from '../../../../src/aggregates/AgencyClient/command-handlers/LinkAgencyClientCommandHandler';
import {LinkAgencyClientCommandInterface} from '../../../../src/aggregates/AgencyClient/types/CommandTypes';

describe('LinkAgencyClientCommandHandler', function () {
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
  const command: LinkAgencyClientCommandInterface = {
    aggregateId: aggregateId,
    type: AgencyClientCommandEnum.LINK_AGENCY_CLIENT,
    data: commandData
  };
  const expectedEvents = [
    {
      type: EventsEnum.AGENCY_CLIENT_LINKED,
      aggregate_id: aggregateId,
      data: commandData,
      sequence_id: 2
    }
  ];

  describe('execute()', function () {
    it('test that correct events are stored', async function () {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(false);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);

      const handler = new LinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      assert.equal(handler.commandType, AgencyClientCommandEnum.LINK_AGENCY_CLIENT, 'Expected command type to match');
      await handler.execute(command);

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });

    it('should not save any events when client is already linked', async function () {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(true);

      const handler = new LinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      await handler.execute(command);

      agencyClientRepositoryStub.save.should.not.have.been.called;
    });

    it('should throw an error when the call to retrieve the aggregate fails', async function () {
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.rejects(new Error('test error'));

      const handler = new LinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      await handler.execute(command).should.be.rejectedWith(Error, 'test error');
    });

    it('should throw an error when the save operation fails', async function () {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.isLinked.returns(false);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      agencyClientRepositoryStub.save.rejects(new Error('blah error'));

      const handler = new LinkAgencyClientCommandHandler(agencyClientRepositoryStub);

      await handler.execute(command).should.be.rejectedWith(Error, 'blah error');

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
    });
  });
});
