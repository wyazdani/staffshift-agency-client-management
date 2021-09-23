import {AgencyClientCommandHandlerInterface, UnlinkAgencyClientCommandData} from '../Interfaces';
import {AgencyClientCommandEnum, AgencyClientEventType} from '../AgencyClientEnums';
import {AgencyClientRepository} from '../AgencyClientRepository';

export class UnlinkAgencyClientCommandHandler implements AgencyClientCommandHandlerInterface {
    public commandType = AgencyClientCommandEnum.UNLINK_AGENCY_CLIENT;

    constructor(private agencyClientRepository: AgencyClientRepository) {}

    async execute(agencyId: string, clientId: string, commandData: UnlinkAgencyClientCommandData): Promise<void> {
        const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

        const isLinked = aggregate.isLinked();
        // If linked OR this is the first time we are dealing with this aggregate
        if (isLinked || aggregate.getLastEventId() == 0) {
            const eventId = aggregate.getLastEventId();
            await this.agencyClientRepository.save([{
                type: AgencyClientEventType.AGENCY_CLIENT_UNLINKED,
                aggregate_id: aggregate.getId(),
                data: {...commandData},
                sequence_id: eventId + 1
            }]);
        }
    }
}