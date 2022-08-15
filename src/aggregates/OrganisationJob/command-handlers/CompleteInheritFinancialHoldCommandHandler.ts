import {EventsEnum} from '../../../Events';
import {CompleteInheritFinancialHoldCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';
import {AgencyClientApplyFinancialHoldInheritanceCompletedEventInterface} from 'EventTypes';

export class CompleteInheritFinancialHoldCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.COMPLETE_INHERIT_FINANCIAL_HOLD;

  async execute(command: CompleteInheritFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateCompleteInheritFinancialHold(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientApplyFinancialHoldInheritanceCompletedEventInterface
    ]);
  }
}
