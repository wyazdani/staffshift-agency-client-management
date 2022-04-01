import {LoggerContext} from 'a24-logzio-winston';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {FacadeClientHelper} from '../../../helpers/FacadeClientHelper';
import {AgencyClientConsultantAssignedEventStoreDataInterface} from 'EventTypes';
import {EventHandlerInterface} from 'EventHandlerInterface';
import {AgencyClientConsultantsProjectionV3} from '../../../models/AgencyClientConsultantsProjectionV3';
import {ResourceNotFoundError} from 'a24-node-error-utils';
import {EventStoreModelInterface} from '../../../models/EventStore';
import {MONGO_ERROR_CODES} from 'staffshift-node-enums';

/**
 * Responsible for handling AgencyClientConsultantAssigned event
 */
export class AgencyClientConsultantAssignedEventHandler
implements EventHandlerInterface<EventStoreModelInterface<AgencyClientConsultantAssignedEventStoreDataInterface>> {
  constructor(
    private logger: LoggerContext,
    private agencyRepository: AgencyRepository,
    private facadeClientHelper: FacadeClientHelper
  ) {}

  /**
   * Create a new agency client consultant record
   */
  async handle(event: EventStoreModelInterface<AgencyClientConsultantAssignedEventStoreDataInterface>): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate(event.aggregate_id.agency_id);
    const role = agencyAggregate.getConsultantRole(event.data.consultant_role_id);
    const agencyClientConsultant = new AgencyClientConsultantsProjectionV3({
      _id: event.data._id,
      agency_id: event.aggregate_id.agency_id,
      client_id: event.aggregate_id.client_id,
      consultant_role_id: event.data.consultant_role_id,
      consultant_role_name: role.name,
      consultant_id: event.data.consultant_id,
      consultant_name: await this.getFullName(event.data.consultant_id)
    });

    try {
      await agencyClientConsultant.save();
    } catch (error) {
      if (error.code === MONGO_ERROR_CODES.DUPLICATE_KEY) {
        this.logger.notice('Duplicate key error for agency client record', agencyClientConsultant.toJSON());
        return;
      }

      this.logger.error('Error occurred while creating agency client record', {
        originalError: error,
        record: agencyClientConsultant.toJSON()
      });
      throw error;
    }
  }

  /**
   * get full name of the consultant
   *
   * @param consultantId
   */
  private async getFullName(consultantId: string): Promise<string> {
    try {
      return await this.facadeClientHelper.getUserFullName(consultantId);
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        this.logger.warning('there is no user with this consultant id', {consultantId});
        return 'Unknown Unknown';
      }
      throw error;
    }
  }
}
