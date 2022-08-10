import {EventsEnum} from '../../../Events';
import {CompleteApplyFinancialHoldCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';

export class CompleteApplyFinancialHoldCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.COMPLETE_APPLY_FINANCIAL_HOLD;

  async execute(command: CompleteApplyFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateCompleteApplyFinancialHold(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      }
    ]);
  }
}
