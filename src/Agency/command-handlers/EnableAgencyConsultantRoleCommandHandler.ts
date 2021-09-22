import {AgencyCommandEnums, AgencyEventEnums} from '../AgencyEnums';
import {AgencyAggregate} from '../AgencyAggregate';
import {AgencyCommandHandlerInterface, EnableAgencyConsultantRoleCommandData} from "../Interfaces";

export class EnableAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.ENABLE_AGENCY_CONSULTANT_ROLE;

    async execute(aggregate: AgencyAggregate, commandData: EnableAgencyConsultantRoleCommandData) {
        let eventId = aggregate.getLastEventId();
        if (!aggregate.canEnableConsultantRole(commandData._id)) {
            return [];
        }
        return [{
            type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ENABLED,
            aggregate_id: aggregate.getId(),
            data: {
                _id: commandData._id
            },
            sequence_id: ++eventId
        }];
    }
}