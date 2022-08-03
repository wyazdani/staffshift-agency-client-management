import {AgencyClientCreditFinancialHoldInheritedEventInterface} from 'EventTypes/AgencyClientCreditFinancialHoldInheritedEventInterface';
import {AgencyClientEmptyFinancialHoldInheritedEventInterface} from 'EventTypes/AgencyClientEmptyFinancialHoldInheritedEventInterface';
import {AgencyClientPayInAdvanceFinancialHoldInheritedEventInterface} from 'EventTypes/AgencyClientPayInAdvanceFinancialHoldInheritedEventInterface';
import {FinancialHoldRepository} from '../FinancialHoldRepository';
import {FINANCIAL_HOLD_ENUM} from '../types/FinancialHoldAggregateRecordInterface';
import {FinancialHoldCommandHandlerInterface} from '../types/FinancialHoldCommandHandlerInterface';
import {FinancialHoldCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {SetInheritedFinancialHoldCommandInterface} from '../types/CommandTypes';

export class SetInheritedFinancialHoldCommandHandler implements FinancialHoldCommandHandlerInterface {
  public commandType = FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD;

  constructor(private repository: FinancialHoldRepository) {}

  /**
   * when force is true, inherited events will be persisted, it means if the node is not inherited, then we will mark it as inherited
   * but if the force is false, it means we have to check if the node is inherited or no. if no throw an exception
   */
  async execute(command: SetInheritedFinancialHoldCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (!command.data.force) {
      aggregate.validateInherited();
    }
    let type: string;

    if (command.data.term === FINANCIAL_HOLD_ENUM.CREDIT) {
      type = EventsEnum.AGENCY_CLIENT_CREDIT_FINANCIAL_HOLD_INHERITED;
    } else if (command.data.term === FINANCIAL_HOLD_ENUM.PAY_IN_ADVANCE) {
      type = EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_FINANCIAL_HOLD_INHERITED;
    } else {
      type = EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED;
    }

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as
        | AgencyClientCreditFinancialHoldInheritedEventInterface
        | AgencyClientPayInAdvanceFinancialHoldInheritedEventInterface
        | AgencyClientEmptyFinancialHoldInheritedEventInterface
    ]);
  }
}
