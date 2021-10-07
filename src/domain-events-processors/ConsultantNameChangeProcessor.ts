import {LoggerContext} from 'a24-logzio-winston';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {FacadeClientHelper} from '../helpers/FacadeClientHelper';
import {AgencyClientConsultantsProjection} from '../models/AgencyClientConsultantsProjection';

export class ConsultantNameChangeProcessor {
  constructor(private logger: LoggerContext, private facadeClientHelper: FacadeClientHelper) {}
  async process(data: GenericObjectInterface): Promise<void> {
    try {
      const userId = data.user_id as string;
      const fullName = await this.facadeClientHelper.getUserFullName(userId);

      this.logger.debug('fetched user full name for consultant name change', {
        fullName,
        userId
      });
      await AgencyClientConsultantsProjection.updateMany(
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
