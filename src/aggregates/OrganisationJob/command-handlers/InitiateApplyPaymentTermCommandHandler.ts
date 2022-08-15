import {EventsEnum} from '../../../Events';
import {InitiateApplyPaymentTermCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';
import {AgencyClientApplyPaymentTermInitiatedEventInterface} from 'EventTypes/AgencyClientApplyPaymentTermInitiatedEventInterface';

export class InitiateApplyPaymentTermCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.INITIATE_APPLY_PAYMENT_TERM;

  async execute(command: InitiateApplyPaymentTermCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateInitiateApplyPaymentTerm(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientApplyPaymentTermInitiatedEventInterface
    ]);
  }
}
