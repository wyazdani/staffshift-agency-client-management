import {AgencyCommandEnums, AgencyEventEnums} from '../AgencyEnums';
import {AgencyCommandHandlerInterface, DisableAgencyConsultantRoleCommandData} from "../Interfaces";
import {AgencyRepository} from "../AgencyRepository";

export class DisableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.DISABLE_AGENCY_CONSULTANT_ROLE;

    constructor(private agencyRepository: AgencyRepository) {}

    async execute(agencyId: string, commandData: DisableAgencyConsultantRoleCommandData) {
        const aggregate = await this.agencyRepository.getAggregate(agencyId);
        const eventId = aggregate.getLastEventId();
        if (!aggregate.canDisableConsultantRole(commandData._id)) {
            return;
        }
        await this.agencyRepository.save([{
            type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DISABLED,
            aggregate_id: aggregate.getId(),
            data: {
                _id: commandData._id
            },
            sequence_id: eventId + 1
        }]);
    }
}