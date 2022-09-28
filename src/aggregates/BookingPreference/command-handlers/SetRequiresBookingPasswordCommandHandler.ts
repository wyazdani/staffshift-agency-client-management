import {AgencyClientRequiresBookingPasswordSetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {SetRequiresBookingPasswordCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class SetRequiresBookingPasswordCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: SetRequiresBookingPasswordCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateSetRequiresBookingPassword();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_SET,
        aggregate_id: aggregate.getId(),
        data: {
          booking_passwords: command.data.booking_passwords
        },
        sequence_id: ++eventId
      } as AgencyClientRequiresBookingPasswordSetEventInterface
    ]);
    return eventId;
  }
}
