import {assert} from 'chai';
import sinon from 'sinon';
import {stubConstructor} from 'ts-sinon';
import {AgencyClientAggregate} from '../../../src/AgencyClient/AgencyClientAggregate';
import {AgencyClientRepository} from '../../../src/AgencyClient/AgencyClientRepository';
import {RemoveAgencyClientConsultantCommandHandler} from '../../../src/AgencyClient/command-handlers/RemoveAgencyClientConsultantCommandHandler';
import {AgencyClientCommandEnum, AgencyClientEventEnum} from '../../../src/AgencyClient/types';
import {RemoveAgencyClientConsultantCommandDataInterface} from '../../../src/AgencyClient/types/CommandDataTypes';

describe('RemoveAgencyClientConsultantCommandHandler', () => {
  afterEach(() => {
    sinon.restore();
  });
  describe('execute()', () => {
    it('Test correct events are persisted', async () => {
      const agencyId = 'agency id';
      const clientId = 'client id';
      const consultantId = 'consultant id';
      const commandData = {
        _id: consultantId
      } as RemoveAgencyClientConsultantCommandDataInterface;
      const repository = stubConstructor(AgencyClientRepository);
      const aggregate = stubConstructor(AgencyClientAggregate);
      const aggregateId = {agency_id: agencyId, client_id: clientId};

      repository.save.resolves();
      repository.getAggregate.resolves(aggregate);
      aggregate.getLastEventId.returns(100);
      aggregate.getId.returns(aggregateId);
      aggregate.validateRemoveClientConsultant.resolves();
      const handler = new RemoveAgencyClientConsultantCommandHandler(repository);

      assert.equal(
        handler.commandType,
        AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT,
        'Expected command type to match'
      );
      await handler.execute(agencyId, clientId, commandData);

      repository.save.should.have.been.calledWith([
        {
          type: AgencyClientEventEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
          aggregate_id: aggregateId,
          data: {
            _id: commandData._id
          },
          sequence_id: 101
        }
      ]);
      repository.getAggregate.should.have.been.calledOnceWith(agencyId, clientId);
      aggregate.validateRemoveClientConsultant.should.have.calledOnceWith(commandData);
    });

    it('Test failure scenario', async () => {
      const agencyId = 'agency id';
      const clientId = 'client id';
      const consultantId = 'consultant id';
      const commandData = {
        _id: consultantId
      } as RemoveAgencyClientConsultantCommandDataInterface;
      const repository = stubConstructor(AgencyClientRepository);
      const aggregate = stubConstructor(AgencyClientAggregate);

      repository.getAggregate.resolves(aggregate);
      const error = new Error('sample');

      aggregate.validateRemoveClientConsultant.rejects(error);
      const handler = new RemoveAgencyClientConsultantCommandHandler(repository);

      await handler.execute(agencyId, clientId, commandData).should.be.rejectedWith(error);
      repository.getAggregate.should.have.been.calledOnceWith(agencyId, clientId);
      aggregate.validateRemoveClientConsultant.should.have.calledOnceWith(commandData);
      repository.save.should.not.have.been.called;
      aggregate.getLastEventId.should.not.have.been.called;
    });
  });
});