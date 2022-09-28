import {AgencyClientRequiresUniquePONumberUnsetEventInterface} from 'EventTypes';
import {EventsEnum} from '../../../Events';
import {BookingPreferenceRepository} from '../BookingPreferenceRepository';
import {BookingPreferenceCommandEnum} from '../types';
import {UnsetRequiresUniquePONumberCommandInterface} from '../types/CommandTypes';
import {BookingPreferenceCommandHandlerInterface} from '../types/BookingPreferenceCommandHandlerInterface';

export class UnsetRequiresUniquePONumberCommandHandler implements BookingPreferenceCommandHandlerInterface {
  public commandType = BookingPreferenceCommandEnum.UNSET_REQUIRES_UNIQUE_PO_NUMBER;

  constructor(private repository: BookingPreferenceRepository) {}

  async execute(command: UnsetRequiresUniquePONumberCommandInterface): Promise<number> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    aggregate.validateUnsetRequiresUniquePONumber();
    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type: EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET,
        aggregate_id: aggregate.getId(),
        data: {},
        sequence_id: ++eventId
      } as AgencyClientRequiresUniquePONumberUnsetEventInterface
    ]);
    return eventId;
  }
}
