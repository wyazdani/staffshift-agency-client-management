import {AgencyClientCommandHandlerInterface, SyncAgencyClientCommandData} from '../Interfaces';
import {AgencyClientCommandEnum, AgencyClientEventType} from '../AgencyClientEnums';
import {AgencyClientRepository} from '../AgencyClientRepository';

export class SyncAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
    public commandType = AgencyClientCommandEnum.SYNC_AGENCY_CLIENT;

    constructor(private agencyClientRepository: AgencyClientRepository) {}

    async execute(agencyId: string, clientId: string, commandData: SyncAgencyClientCommandData): Promise<void> {
        const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

        // Only create the event if we are not aware of the this aggregate
        if (aggregate.getLastEventId() === 0) {
            let eventId = aggregate.getLastEventId();
            await this.agencyClientRepository.save([{
                type: AgencyClientEventType.AGENCY_CLIENT_SYNCED,
                aggregate_id: aggregate.getId(),
                data: {...commandData},
                sequence_id: ++eventId
            }]);
        }
    }
}