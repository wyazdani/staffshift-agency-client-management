import {assert} from 'chai';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {TransferAgencyClientConsultantCommandHandler} from '../../../../src/aggregates/AgencyClient/command-handlers';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {stubConstructor} from 'ts-sinon';
import {EventsEnum} from '../../../../src/Events';
import {TransferAgencyClientConsultantCommandInterface} from '../../../../src/aggregates/AgencyClient/types/CommandTypes';

describe('TransferAgencyClientConsultantCommandHandler', () => {
  describe('execute()', () => {
    const agencyId = '6141d9cb9fb4b44d53469145';
    const clientId = '6141d9cb9fb4b44d53469146';
    const aggregateId = {
      agency_id: agencyId,
      client_id: clientId
    };
    const commandData = {
      from_id: 'some id',
      to_id: 'some new id',
      to_consultant_id: 'to consultant id',
      to_consultant_role_id: 'to consultant role id'
    };
    const command: TransferAgencyClientConsultantCommandInterface = {
      aggregateId: aggregateId,
      type: AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
      data: commandData
    };
    const expectedEvents = [
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
        aggregate_id: aggregateId,
        data: {
          _id: commandData.from_id
        },
        sequence_id: 2
      },
      {
        type: EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
        aggregate_id: aggregateId,
        data: {
          _id: commandData.to_id,
          consultant_id: commandData.to_consultant_id,
          consultant_role_id: commandData.to_consultant_role_id
        },
        sequence_id: 3
      }
    ];

    it('test success scenario where consultant is not already assigned', async () => {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new TransferAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.validateTransferClientConsultant.resolves();
      agencyClientAggregateStub.isConsultantAlreadyAssigned.returns(false);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command);

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
      agencyClientAggregateStub.isConsultantAlreadyAssigned.should.have.been.calledOnceWith(
        commandData.to_consultant_id,
        commandData.to_consultant_role_id
      );
    });

    it('test success scenario where consultant is already assigned', async () => {
      const expectedEvents = [
        {
          type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
          aggregate_id: aggregateId,
          data: {
            _id: commandData.from_id
          },
          sequence_id: 2
        }
      ];
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new TransferAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.validateTransferClientConsultant.resolves();
      agencyClientAggregateStub.isConsultantAlreadyAssigned.returns(true);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command);

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
      agencyClientAggregateStub.isConsultantAlreadyAssigned.should.have.been.calledOnceWith(
        commandData.to_consultant_id,
        commandData.to_consultant_role_id
      );
    });

    it('should throw an error when the save operation fails', async () => {
      const agencyClientAggregateStub = stubConstructor(AgencyClientAggregate);
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new TransferAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.resolves(agencyClientAggregateStub);
      agencyClientAggregateStub.validateTransferClientConsultant.resolves();
      agencyClientAggregateStub.isConsultantAlreadyAssigned.returns(false);
      agencyClientAggregateStub.getLastSequenceId.returns(1);
      agencyClientAggregateStub.getId.returns(aggregateId);
      agencyClientRepositoryStub.save.rejects(new Error('blah error'));
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command).should.be.rejectedWith(Error, 'blah error');

      agencyClientRepositoryStub.save.should.have.been.calledOnceWith(expectedEvents);
      agencyClientAggregateStub.isConsultantAlreadyAssigned.should.have.been.calledOnceWith(
        commandData.to_consultant_id,
        commandData.to_consultant_role_id
      );
    });

    it('should throw an error when the call to retrieve the aggregate fails', async () => {
      const agencyClientRepositoryStub = stubConstructor(AgencyClientRepository);
      const handler = new TransferAgencyClientConsultantCommandHandler(agencyClientRepositoryStub);

      agencyClientRepositoryStub.getAggregate.rejects(new Error('some error here'));
      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command).should.be.rejectedWith(Error, 'some error here');

      assert.equal(agencyClientRepositoryStub.save.callCount, 0, 'no events should be saved');
    });
  });
});
