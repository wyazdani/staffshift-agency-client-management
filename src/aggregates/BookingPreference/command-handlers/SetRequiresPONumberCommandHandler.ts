import {AgencyClientRequiresPONumberSetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {SetRequiresPONumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class SetRequiresPONumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: SetRequiresPONumberCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    await aggregate.validateSetRequiresPONumber();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET,
        aggregate_id: aggregate.getId(),
        data: {
          requires_po_number: true
        },
        sequence_id: ++eventId
      } as AgencyClientRequiresPONumberSetEventInterface
    ]);
  }
}
