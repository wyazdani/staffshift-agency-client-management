import {AgencyCommandEnums, AgencyEventEnums} from '../AgencyEnums';
import {AgencyAggregate} from '../AgencyAggregate';
import {AgencyCommandHandlerInterface, UpdateAgencyConsultantRoleCommandData} from "../Interfaces";

export class UpdateAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.UPDATE_AGENCY_CONSULTANT_ROLE;

    async execute(aggregate: AgencyAggregate, commandData: UpdateAgencyConsultantRoleCommandData) {
        let eventId = aggregate.getLastEventId();
        return [{
            type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED,
            aggregate_id: aggregate.getId(),
            data: {...commandData},
            sequence_id: ++eventId
        }];
    }
}