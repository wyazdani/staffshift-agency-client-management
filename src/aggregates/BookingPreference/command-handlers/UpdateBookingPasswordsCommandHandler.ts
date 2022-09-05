import {AgencyClientBookingPasswordsUpdatedEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {UpdateBookingPasswordsCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class UpdateBookingPasswordsCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.UPDATE_BOOKING_PASSWORDS;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: UpdateBookingPasswordsCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateUpdateBookingPasswords();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_BOOKING_PASSWORDS_UPDATED,
        aggregate_id: aggregate.getId(),
        data: {
          booking_passwords: command.data.booking_passwords
        },
        sequence_id: ++eventId
      } as AgencyClientBookingPasswordsUpdatedEventInterface
    ]);
  }
}
