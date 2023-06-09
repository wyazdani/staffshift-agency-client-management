import {EventsEnum} from '../../../Events';
import {CompleteApplyPaymentTermCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';
import {AgencyClientApplyPaymentTermCompletedEventInterface} from 'EventTypes/AgencyClientApplyPaymentTermCompletedEventInterface';

export class CompleteApplyPaymentTermCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.COMPLETE_APPLY_PAYMENT_TERM;

  async execute(command: CompleteApplyPaymentTermCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateCompleteApplyPaymentTerm(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientApplyPaymentTermCompletedEventInterface
    ]);
    return eventId;
  }
}
