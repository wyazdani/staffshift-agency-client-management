import {LoggerContext} from 'a24-logzio-winston';
import {UserUpdateDomainEventDataInterface} from 'UserUpdateDomainEventDataInterface';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';
import {AgencyClientConsultantsProjectionV3} from '../models/AgencyClientConsultantsProjectionV3';

export class ConsultantNameChangeProcessor {
  /**
   * Listens for events on consultant name changes from domain event and update it on projection
   *
   * @param logger
   * @param facadeClientHelper
   */
  constructor(private logger: LoggerContext, private facadeClientHelper: FacadeClientHelper) {}
  async process(data: UserUpdateDomainEventDataInterface): Promise<void> {
    try {
      const userId: string = data.user_id;
      const fullName = await this.facadeClientHelper.getUserFullName(userId);

      this.logger.debug('fetched user full name for consultant name change', {
        fullName,
        userId
      });

      await AgencyClientConsultantsProjectionV3.updateMany(
        {
          consultant_id: userId
        },
        {
          $set: {
            consultant_name: fullName
          }
        }
      );
      this.logger.info('AgencyClientConsultantsProjection consultant name updated', {
        consultantId: userId
      });
    } catch (error) {
      this.logger.error('Error in ConsultantNameChangeProcessor', {
        error,
        data
      });
      throw error;
    }
  }
}
