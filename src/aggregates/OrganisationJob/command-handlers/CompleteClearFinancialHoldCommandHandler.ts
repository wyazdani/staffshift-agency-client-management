import {EventsEnum} from '../../../Events';
import {CompleteClearFinancialHoldCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';
import {AgencyClientClearFinancialHoldCompletedEventInterface} from 'EventTypes';

export class CompleteClearFinancialHoldCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType = OrganisationJobCommandEnum.COMPLETE_CLEAR_FINANCIAL_HOLD;

  async execute(command: CompleteClearFinancialHoldCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateCompleteClearFinancialHold(command.data);

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      } as AgencyClientClearFinancialHoldCompletedEventInterface
    ]);
    return eventId;
  }
}
