import {AgencyClientRequiresShiftRefNumberUnsetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {UnsetRequiresShiftRefNumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class UnsetRequiresShiftRefNumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.UNSET_REQUIRES_SHIFT_REF_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: UnsetRequiresShiftRefNumberCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateUnsetRequiresShiftRefNumber();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientRequiresShiftRefNumberUnsetEventInterface
    ]);
    return eventId;
  }
}
