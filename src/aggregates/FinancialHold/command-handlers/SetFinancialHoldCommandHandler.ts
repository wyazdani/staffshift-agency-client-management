import {AgencyClientCreditFinancialHoldAppliedEventInterface} from 'EventTypes/AgencyClientCreditFinancialHoldAppliedEventInterface';
import {AgencyClientPayInAdvanceFinancialHoldAppliedEventInterface} from 'EventTypes/AgencyClientPayInAdvanceFinancialHoldAppliedEventInterface';
import {EventsEnum} from '../../../Events';
import {FinancialHoldRepository} from '../FinancialHoldRepository';
import {FinancialHoldCommandEnum} from '../types';
import {SetFinancialHoldCommandInterface} from '../types/CommandTypes';
import {FINANCIAL_HOLD_ENUM} from '../types/FinancialHoldAggregateRecordInterface';
import {FinancialHoldCommandHandlerInterface} from '../types/FinancialHoldCommandHandlerInterface';

export class SetFinancialHoldCommandHandler implements FinancialHoldCommandHandlerInterface {
  public commandType = FinancialHoldCommandEnum.SET_FINANCIAL_HOLD;

  constructor(private repository: FinancialHoldRepository) {}

  async execute(command: SetFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type:
          command.data.term === FINANCIAL_HOLD_ENUM.CREDIT
            ? EventsEnum.AGENCY_CLIENT_CREDIT_FINANCIAL_HOLD_APPLIED
            : EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_FINANCIAL_HOLD_APPLIED,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientCreditFinancialHoldAppliedEventInterface | AgencyClientPayInAdvanceFinancialHoldAppliedEventInterface
    ]);
  }
}
