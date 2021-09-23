import {AgencyClientCommandHandlerInterface, AgencyClientConsultant} from '../Interfaces';
import {AgencyClientCommandEnum, AgencyClientEventType} from '../AgencyClientEnums';
import {AgencyClientRepository} from '../AgencyClientRepository';

export class AddAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
    public commandType = AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT;

    constructor(private agencyClientRepository: AgencyClientRepository) {}

    async execute(agencyId: string, clientId: string, commandData: AgencyClientConsultant): Promise<void> {
        const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

        await aggregate.validateRemoveClientConsultant(commandData);
        const eventId = aggregate.getLastEventId();
        await this.agencyClientRepository.save([{
            type: AgencyClientEventType.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
            aggregate_id: aggregate.getId(),
            data: {
                _id: commandData._id
            },
            sequence_id: eventId + 1
        }]);
    }
}