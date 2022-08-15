import {EventsEnum} from '../../../Events';
import {InitiateApplyFinancialHoldCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';
import {AgencyClientApplyFinancialHoldInitiatedEventInterface} from 'EventTypes';

export class InitiateApplyFinancialHoldCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.INITIATE_APPLY_FINANCIAL_HOLD;

  async execute(command: InitiateApplyFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateInitiateApplyFinancialHold(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientApplyFinancialHoldInitiatedEventInterface
    ]);
  }
}
