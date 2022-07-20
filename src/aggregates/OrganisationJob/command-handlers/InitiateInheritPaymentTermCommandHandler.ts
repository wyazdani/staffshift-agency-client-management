import {EventsEnum} from '../../../Events';
import {InitiateApplyPaymentTermCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';

export class InitiateInheritPaymentTermCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType: OrganisationJobCommandEnum.APPLY_PAYMENT_TERM;

  async execute(command: InitiateApplyPaymentTermCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateInitiateInheritPaymentTerm(command.data);

    const type = EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED;

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
