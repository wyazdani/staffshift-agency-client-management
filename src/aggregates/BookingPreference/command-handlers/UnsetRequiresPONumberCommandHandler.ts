import {AgencyClientRequiresPONumberUnsetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {SetRequiresPONumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

/**
 * `requires_po_number` is required and we will pick it from the command
 */
export class UnsetRequiresPONumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: SetRequiresPONumberCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
        aggregate_id: aggregate.getId(),
        data: {
          requires_po_number: command.data.requires_po_number
        },
        sequence_id: ++eventId
      } as AgencyClientRequiresPONumberUnsetEventInterface
    ]);
  }
}
