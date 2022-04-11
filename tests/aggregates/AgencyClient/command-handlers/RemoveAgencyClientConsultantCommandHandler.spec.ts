import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../../src/aggregates/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../../src/aggregates/AgencyClient/AgencyClientRepository';
import {RemoveAgencyClientConsultantCommandHandler} from '../../../../src/aggregates/AgencyClient/command-handlers/RemoveAgencyClientConsultantCommandHandler';
import {AgencyClientCommandEnum} from '../../../../src/aggregates/AgencyClient/types';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../../../../src/aggregates/AgencyClient/types/CommandDataTypes';
import {RemoveAgencyClientConsultantCommandInterface} from '../../../../src/aggregates/AgencyClient/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('RemoveAgencyClientConsultantCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    const agencyId = 'agency id';
    const clientId = 'client id';
    const consultantId = 'consultant id';
    const commandData = {
      _id: consultantId
    } as RemoveAgencyClientConsultantCommandDataInterface;
    const command: RemoveAgencyClientConsultantCommandInterface = {
      aggregateId: {
        agency_id: agencyId,
        client_id: clientId
      },
      type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT,
      data: commandData
    };

    it('Test correct events are persisted', async () => {
      const repository = stubConstructor(AgencyClientRepository);
      const aggregate = stubConstructor(AgencyClientAggregate);
      const aggregateId = {agency_id: agencyId, client_id: clientId};

      repository.save.resolves();
      repository.getAggregate.resolves(aggregate);
      aggregate.getLastSequenceId.returns(100);
      aggregate.getId.returns(aggregateId);
      aggregate.validateRemoveClientConsultant.resolves();
      const handler = new RemoveAgencyClientConsultantCommandHandler(repository);

      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(command);

      repository.save.should.have.been.calledWith([
        {
          type: EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
          aggregate_id: aggregateId,
          data: {
            _id: commandData._id
          },
          sequence_id: 101
        }
      ]);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateRemoveClientConsultant.should.have.calledOnceWith(command.data);
    });

    it('Test failure scenario', async () => {
      const repository = stubConstructor(AgencyClientRepository);
      const aggregate = stubConstructor(AgencyClientAggregate);

      repository.getAggregate.resolves(aggregate);
      const error = new Error('sample');

      aggregate.validateRemoveClientConsultant.rejects(error);
      const handler = new RemoveAgencyClientConsultantCommandHandler(repository);

      await handler.execute(command).should.be.rejectedWith(Error, 'sample');
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateRemoveClientConsultant.should.have.calledOnceWith(command.data);
      repository.save.should.not.have.been.called;
      aggregate.getLastSequenceId.should.not.have.been.called;
    });
  });
});
