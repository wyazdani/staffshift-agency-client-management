import {AgencyCommandEnums, AgencyEventEnums} from '../AgencyEnums';
import {AgencyAggregate} from '../AgencyAggregate';
import {AgencyCommandHandlerInterface, DisableAgencyConsultantRoleCommandData} from "../Interfaces";

export class DisableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.DISABLE_AGENCY_CONSULTANT_ROLE;

    async execute(aggregate: AgencyAggregate, commandData: DisableAgencyConsultantRoleCommandData) {
        let eventId = aggregate.getLastEventId();
        if (!aggregate.canDisableConsultantRole(commandData._id)) {
            return [];
        }
        return [{
            type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DISABLED,
            aggregate_id: aggregate.getId(),
            data: {
                _id: commandData._id
            },
            sequence_id: ++eventId
        }];
    }
}