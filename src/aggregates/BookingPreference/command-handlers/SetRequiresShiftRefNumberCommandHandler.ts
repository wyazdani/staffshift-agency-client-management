import {AgencyClientRequiresShiftRefNumberSetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {SetRequiresShiftRefNumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class SetRequiresShiftRefNumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: SetRequiresShiftRefNumberCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateSetRequiresShiftRefNumber();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientRequiresShiftRefNumberSetEventInterface
    ]);
    return eventId;
  }
}
