import {AgencyClientRequiresBookingPasswordUnsetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {UnsetRequiresBookingPasswordCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class UnsetRequiresBookingPasswordCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.UNSET_REQUIRES_BOOKING_PASSWORD;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: UnsetRequiresBookingPasswordCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateUnsetRequiresBookingPassword();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_BOOKING_PASSWORD_UNSET,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientRequiresBookingPasswordUnsetEventInterface
    ]);
  }
}
