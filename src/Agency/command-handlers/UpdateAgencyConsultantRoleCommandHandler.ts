import {AgencyCommandEnums, AgencyEventEnums} from '../AgencyEnums';
import {AgencyCommandHandlerInterface, UpdateAgencyConsultantRoleCommandData} from "../Interfaces";
import {AgencyRepository} from "../AgencyRepository";

export class UpdateAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.UPDATE_AGENCY_CONSULTANT_ROLE;

    constructor(private agencyRepository: AgencyRepository) {}

    async execute(agencyId: string, commandData: UpdateAgencyConsultantRoleCommandData) {
        const aggregate = await this.agencyRepository.getAggregate(agencyId);
        const eventId = aggregate.getLastEventId();
        await this.agencyRepository.save([{
            type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
            aggregate_id: aggregate.getId(),
            data: {...commandData},
            sequence_id: eventId + 1
        }]);
    }
}