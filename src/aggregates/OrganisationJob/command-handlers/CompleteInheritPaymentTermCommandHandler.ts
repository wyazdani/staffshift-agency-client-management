import {EventsEnum} from '../../../Events';
import {CompleteInheritPaymentTermCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';

export class CompleteInitiatePaymentTermCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.COMPLETE_INHERIT_PAYMENT_TERM;

  async execute(command: CompleteInheritPaymentTermCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateCompleteInheritPaymentTerm(command.data);

    const type = EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED;

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      }
    ]);
  }
}
