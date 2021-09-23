import {AgencyCommandEnums, AgencyEventEnums} from '../AgencyEnums';
import {AgencyCommandHandlerInterface, EnableAgencyConsultantRoleCommandData} from "../Interfaces";
import {AgencyRepository} from "../AgencyRepository";

export class EnableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.ENABLE_AGENCY_CONSULTANT_ROLE;

    constructor(private agencyRepository: AgencyRepository) {}

    async execute(agencyId: string, commandData: EnableAgencyConsultantRoleCommandData): Promise<void> {
        const aggregate = await this.agencyRepository.getAggregate(agencyId);
        const eventId = aggregate.getLastEventId();
        if (!aggregate.canEnableConsultantRole(commandData._id)) {
            return;
        }
        await this.agencyRepository.save([{
            type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ENABLED,
            aggregate_id: aggregate.getId(),
            data: {
                _id: commandData._id
            },
            sequence_id: eventId + 1
        }]);
    }
}