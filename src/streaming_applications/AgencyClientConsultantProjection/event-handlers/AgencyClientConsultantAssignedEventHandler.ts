import {LoggerContext} from 'a24-logzio-winston';
import {FacadeClientHelper} from '../../../helpers/FacadeClientHelper';
import {EventHandlerInterface} from '../types/EventHandlerInterface';
import {AgencyClientConsultantsProjection} from '../../../models/AgencyClientConsultantsProjection';
import {AgencyRepository} from '../../../Agency/AgencyRepository';
import {EventInterface} from '../types/EventInterface';
import {AddAgencyClientConsultantCommandDataInterface} from '../../../AgencyClient/types/CommandDataTypes';
import {ResourceNotFoundError} from 'a24-node-error-utils';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientConsultantAssignedEventHandler implements EventHandlerInterface {
  constructor(
    private logger: LoggerContext,
    private agencyRepository: AgencyRepository,
    private facadeClientHelper: FacadeClientHelper
  ) {}

  /**
   * Create a new agency client consultant record
   */
  async handle(event: EventInterface<AddAgencyClientConsultantCommandDataInterface>): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate(event.aggregate_id.agency_id);
    const role = agencyAggregate.getConsultantRole(event.data.consultant_role_id);
    const agencyClientConsultant = new AgencyClientConsultantsProjection({
      _id: event.data._id,
      agency_id: event.aggregate_id.agency_id,
      client_id: event.aggregate_id.client_id,
      consultant_role_id: event.data.consultant_role_id,
      consultant_role_name: role.name,
      consultant_id: event.data.consultant_id,
      consultant_name: await this.getFullName(event.data.consultant_id)
    });

    await agencyClientConsultant.save();
  }

  /**
   * get full name of the consultant
   *
   * @param consultantId
   * @private
   */
  private async getFullName(consultantId: string): Promise<string> {
    try {
      return await this.facadeClientHelper.getUserFullName(consultantId);
    } catch (error: any) {
      if (error instanceof ResourceNotFoundError) {
        this.logger.warning('there is no user with this consultant id', {consultantId});
        return 'Unknown Unknown';
      }
      throw error;
    }
  }
}
