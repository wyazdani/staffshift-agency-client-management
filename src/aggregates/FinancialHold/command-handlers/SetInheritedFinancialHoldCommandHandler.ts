import {
  AgencyClientFinancialHoldInheritedEventInterface,
  AgencyClientClearFinancialHoldInheritedEventInterface,
  AgencyClientEmptyFinancialHoldInheritedEventInterface
} from 'EventTypes';
import {FinancialHoldRepository} from '../FinancialHoldRepository';
import {FinancialHoldCommandHandlerInterface} from '../types/FinancialHoldCommandHandlerInterface';
import {FinancialHoldCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';
import {SetInheritedFinancialHoldCommandInterface} from '../types/CommandTypes';

/**
 * when force is true, inherited events will be persisted, it means if the node is not inherited, then we will mark it as inherited
 * but if the force is false, it means we have to check if the node is inherited or no. if no throw an exception
 */
export class SetInheritedFinancialHoldCommandHandler implements FinancialHoldCommandHandlerInterface {
  public commandType = FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD;

  constructor(private repository: FinancialHoldRepository) {}

  async execute(command: SetInheritedFinancialHoldCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    if (!command.data.force) {
      aggregate.validateInherited();
    }
    let type: string;
    let note: string;

    if (command.data.financial_hold === true) {
      type = EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED;
      note = command.data.note;
    } else if (command.data.financial_hold === false) {
      type = EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED;
      note = command.data.note;
    } else {
      type = EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED;
      note = command.data.note;
    }

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type,
        aggregate_id: aggregate.getId(),
        data: {
          ...(note && {note})
        },
        sequence_id: ++eventId
      } as
        | AgencyClientFinancialHoldInheritedEventInterface
        | AgencyClientClearFinancialHoldInheritedEventInterface
        | AgencyClientEmptyFinancialHoldInheritedEventInterface
    ]);
    return eventId;
  }
}
