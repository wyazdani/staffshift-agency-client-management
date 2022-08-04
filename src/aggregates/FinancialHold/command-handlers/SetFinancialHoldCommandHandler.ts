import {
  AgencyClientFinancialHoldAppliedEventInterface,
  AgencyClientFinancialHoldClearedEventInterface
} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {FinancialHoldRepository} from '../FinancialHoldRepository';
import {FinancialHoldCommandEnum} from '../types';
import {SetFinancialHoldCommandInterface} from '../types/CommandTypes';
import {FinancialHoldCommandHandlerInterface} from '../types/FinancialHoldCommandHandlerInterface';

/**
 * based on `financial_hold` property decides to insert applied financial hold or cleared financial hold events
 * `note` is required and we will pick it from the command
 */
export class SetFinancialHoldCommandHandler implements FinancialHoldCommandHandlerInterface {
  public commandType = FinancialHoldCommandEnum.SET_FINANCIAL_HOLD;

  constructor(private repository: FinancialHoldRepository) {}

  async execute(command: SetFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: command.data.financial_hold
          ? EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED
          : EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED,
        aggregate_id: aggregate.getId(),
        data: {
          note: command.data.note
        },
        sequence_id: ++eventId
      } as AgencyClientFinancialHoldAppliedEventInterface | AgencyClientFinancialHoldClearedEventInterface
    ]);
  }
}
