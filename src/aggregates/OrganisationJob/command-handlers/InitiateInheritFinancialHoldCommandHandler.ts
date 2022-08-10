import {EventsEnum} from '../../../Events';
import {InitiateInheritFinancialHoldCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';

export class InitiateInheritFinancialHoldCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.INITIATE_INHERIT_FINANCIAL_HOLD;

  async execute(command: InitiateInheritFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateInitiateInheritFinancialHold(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      }
    ]);
  }
}
