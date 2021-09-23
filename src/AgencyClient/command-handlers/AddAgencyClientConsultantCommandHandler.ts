import {AgencyClientCommandHandlerInterface, AgencyClientConsultant} from '../Interfaces';
import {AgencyClientCommandEnum, AgencyClientEventType} from '../AgencyClientEnums';
import {AgencyClientRepository} from '../AgencyClientRepository';
import {ObjectID} from 'mongodb';

export class AddAgencyClientConsultantCommandHandler implements AgencyClientCommandHandlerInterface {
    public commandType = AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT;

    constructor(private agencyClientRepository: AgencyClientRepository) {}

    async execute(agencyId: string, clientId: string, commandData: AgencyClientConsultant): Promise<void> {
        const aggregate = await this.agencyClientRepository.getAggregate(agencyId, clientId);

        await aggregate.validateAddClientConsultant(commandData);
        const eventId = aggregate.getLastEventId();
        await this.agencyClientRepository.save([{
            type: AgencyClientEventType.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
            aggregate_id: aggregate.getId(),
            data: {
                _id: (new ObjectID).toString(),
                consultant_role_id: commandData.consultant_role_id,
                consultant_id: commandData.consultant_id
            },
            sequence_id: eventId + 1
        }]);
    }
}