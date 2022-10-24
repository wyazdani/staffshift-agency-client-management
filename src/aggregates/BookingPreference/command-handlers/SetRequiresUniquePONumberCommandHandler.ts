import {AgencyClientRequiresUniquePONumberSetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {SetRequiresUniquePONumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class SetRequiresUniquePONumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: SetRequiresUniquePONumberCommandInterface): Promise<number> {
    const aggregate = await this.repository.getCommandAggregate(command);

    aggregate.validateSetRequiresUniquePONumber();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientRequiresUniquePONumberSetEventInterface
    ]);
    return eventId;
  }
}
