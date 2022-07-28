import sinon, {stubInterface} from 'ts-sinon';
import {InitiateApplyPaymentTermCommandHandler} from '../../../../src/aggregates/OrganisationJob/command-handlers/InitiateApplyPaymentTermCommandHandler';
import {OrganisationJobAggregate} from '../../../../src/aggregates/OrganisationJob/OrganisationJobAggregate';
import {OrganisationJobRepository} from '../../../../src/aggregates/OrganisationJob/OrganisationJobRepository';
import {OrganisationJobCommandEnum} from '../../../../src/aggregates/OrganisationJob/types';
import {InitiateApplyPaymentTermCommandInterface} from '../../../../src/aggregates/OrganisationJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('InitiateApplyPaymentTermCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const organisationId = 'organisation_id';
    const clientId = 'client_id';
    const command: InitiateApplyPaymentTermCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        organisation_id: organisationId
      },
      type: OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM,
      data: {
        _id: 'id',
        client_id: clientId,
        term: 'credit'
      }
    };

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const repository = stubInterface<OrganisationJobRepository>();
      const aggregate = stubInterface<OrganisationJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateInitiateApplyPaymentTerm.resolves();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new InitiateApplyPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateInitiateApplyPaymentTerm.should.have.been.calledOnceWith(command.data);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });
  });
});
