import {
  AgencyClientFinancialHoldInheritedEventInterface,
  AgencyClientClearFinancialHoldInheritedEventInterface,
  AgencyClientEmptyFinancialHoldInheritedEventInterface
} from 'EventTypes';
import {FinancialHoldRepository} from '../FinancialHoldRepository';
import {InheritFinancialHoldClientLinkCommandInterface} from '../types/CommandTypes';
import {FinancialHoldCommandHandlerInterface} from '../types/FinancialHoldCommandHandlerInterface';
import {FinancialHoldCommandEnum} from '../types';
import {EventsEnum} from '../../../Events';

/**
 * The command used when a new agency client link event is received
 */
export class InheritFinancialHoldClientLinkCommandHandler implements FinancialHoldCommandHandlerInterface {
  public commandType = FinancialHoldCommandEnum.INHERIT_FINANCIAL_HOLD_CLIENT_LINK;

  constructor(private repository: FinancialHoldRepository) {}

  async execute(command: InheritFinancialHoldClientLinkCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    let type: string;

    if (command.data.financial_hold === true) {
      type = EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED;
    } else if (command.data.financial_hold === false) {
      type = EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED;
    } else {
      if (aggregate.getLastSequenceId() === 0) {
        return;
      }
      type = EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED;
    }

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type,
        aggregate_id: aggregate.getId(),
        data: {
          ...(command.data.note && {note: command.data.note})
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
