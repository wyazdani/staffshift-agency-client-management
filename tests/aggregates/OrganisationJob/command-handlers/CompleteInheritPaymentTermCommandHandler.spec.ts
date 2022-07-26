import sinon, {stubInterface} from 'ts-sinon';
import {CompleteInheritPaymentTermCommandHandler} from '../../../../src/aggregates/OrganisationJob/command-handlers/CompleteInheritPaymentTermCommandHandler';
import {OrganisationJobAggregate} from '../../../../src/aggregates/OrganisationJob/OrganisationJobAggregate';
import {OrganisationJobRepository} from '../../../../src/aggregates/OrganisationJob/OrganisationJobRepository';
import {OrganisationJobCommandEnum} from '../../../../src/aggregates/OrganisationJob/types';
import {CompleteInheritPaymentTermCommandInterface} from '../../../../src/aggregates/OrganisationJob/types/CommandTypes';
import {EventsEnum} from '../../../../src/Events';

describe('CompleteInheritPaymentTermCommandHandler class', () => {
  describe('execute()', () => {
    const agencyId = 'agency id';
    const organisationId = 'organisation_id';
    const clientId = 'client_id';
    const command: CompleteInheritPaymentTermCommandInterface = {
      aggregateId: {
        name: 'organisation_job',
        agency_id: agencyId,
        organisation_id: organisationId
      },
      type: OrganisationJobCommandEnum.COMPLETE_INHERIT_PAYMENT_TERM,
      data: {
        _id: 'id'
      }
    };

    afterEach(() => {
      sinon.restore();
    });
    it('Test success scenario', async () => {
      const repository = stubInterface<OrganisationJobRepository>();
      const aggregate = stubInterface<OrganisationJobAggregate>();

      repository.getAggregate.resolves(aggregate);
      aggregate.validateCompleteInheritPaymentTerm.resolves();
      aggregate.getLastSequenceId.returns(1);
      repository.save.resolves();
      const handler = new CompleteInheritPaymentTermCommandHandler(repository);

      await handler.execute(command);
      repository.getAggregate.should.have.been.calledOnceWith(command.aggregateId);
      aggregate.validateCompleteInheritPaymentTerm.should.have.been.calledOnceWith(command.data);
      repository.save.should.have.been.calledOnceWith([
        {
          type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED,
          aggregate_id: aggregate.getId(),
          data: command.data,
          sequence_id: 2
        }
      ]);
    });
  });
});
