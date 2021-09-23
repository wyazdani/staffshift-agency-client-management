import {ObjectID} from 'mongodb';
import {AgencyEventEnums} from '../AgencyEnums';
import {AgencyCommandEnums} from '../AgencyEnums';
import {AddAgencyConsultantRoleCommandData, AgencyCommandHandlerInterface} from '../Interfaces';
import {AgencyRepository} from '../AgencyRepository';

export class AddAgencyConsultantRoleCommandHandler implements AgencyCommandHandlerInterface {
    public commandType = AgencyCommandEnums.ADD_AGENCY_CONSULTANT_ROLE;

    constructor(private agencyRepository: AgencyRepository) {}

    async execute(agencyId: string, commandData: AddAgencyConsultantRoleCommandData): Promise<void> {
        const aggregate = await this.agencyRepository.getAggregate(agencyId);
        let eventId = aggregate.getLastEventId();
        // We are looking to auto enable newly created consultant roles hence the two events
        await this.agencyRepository.save([
            {
                type: AgencyEventEnums.AGENCY_CONSULTANT_ROLE_ADDED,
                aggregate_id: aggregate.getId(),
                data: {
                    _id: commandData.id,
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
                    _id: commandData.id
                },
                sequence_id: ++eventId
            }
        ]);
    }
}