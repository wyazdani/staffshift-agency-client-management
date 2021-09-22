import {AgencyAggregate} from '../AgencyAggregate';
import {ObjectID} from 'mongodb';
import {AgencyEventEnums} from '../AgencyEnums';
import {AgencyCommandEnums} from '../AgencyEnums';
import {AddAgencyConsultantRoleCommandData, AgencyCommandHandlerInterface} from "../Interfaces";

export class AddAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.ADD_AGENCY_CONSULTANT_ROLE;

    async execute(aggregate: AgencyAggregate, commandData: AddAgencyConsultantRoleCommandData) {
        let eventId = aggregate.getLastEventId();
        // We are looking to auto enable newly created consultant roles hence the two events
        const consultantId = (new ObjectID).toString();
        return [
            {
                type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ADDED,
                aggregate_id: aggregate.getId(),
                data: {
                    _id: consultantId,
                    name: commandData.name,
                    description: commandData.description,
                    max_consultants: commandData.max_consultants
                },
                sequence_id: ++eventId
            },
            {
                type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ENABLED,
                aggregate_id: aggregate.getId(),
                data: {
                    _id: consultantId
                },
                sequence_id: ++eventId
            }
        ];
    }
}