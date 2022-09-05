import {AgencyClientRequiresPONumberUnsetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {UnsetRequiresPONumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class UnsetRequiresPONumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.UNSET_REQUIRES_PO_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: UnsetRequiresPONumberCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateUnsetRequiresPONumber();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientRequiresPONumberUnsetEventInterface
    ]);
  }
}
