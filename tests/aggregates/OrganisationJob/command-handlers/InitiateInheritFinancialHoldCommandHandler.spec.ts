import sinon, {stubInterface} from 'ts-sinon';
import {InitiateInheritFinancialHoldCommandHandler} from '../../../../src/aggregates/OrganisationJob/command-handlers/InitiateInheritFinancialHoldCommandHandler';
import {OrganisationJobAggregate} from '../../../../src/aggregates/OrganisationJob/OrganisationJobAggregate';
import {OrganisationJobRepository} from '../../../../src/aggregates/OrganisationJob/OrganisationJobRepository';
import {OrganisationJobCommandEnum} from '../../../../src/aggregates/OrganisationJob/types';
import {InitiateInheritFinancialHoldCommandInterface} from '../../../../src/aggregates/OrganisationJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('InitiateInheritFinancialHoldCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const organisationId = 'organisation_id';
    const clientId = 'client_id';
    const command: InitiateInheritFinancialHoldCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        organisation_id: organisationId
      },
      type: OrganisationJobCommandEnum.INITIATE_INHERIT_FINANCIAL_HOLD,
      data: {
        _id: 'id',
        client_id: clientId,
        note: 'test'
      }
    };

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const repository = stubInterface<OrganisationJobRepository>();
      const aggregate = stubInterface<OrganisationJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInitiateInheritFinancialHold.resolves();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new InitiateInheritFinancialHoldCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInitiateInheritFinancialHold.should.have.been.calledOnceWith(command.data);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });
  });
});
