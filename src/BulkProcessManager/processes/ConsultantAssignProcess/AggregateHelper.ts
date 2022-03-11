import {ObjectID} from 'mongodb';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientCommandBus} from '../../../aggregates/AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from '../../../aggregates/AgencyClient/types';
import {AddAgencyClientConsultantCommandDataInterface} from '../../../aggregates/AgencyClient/types/CommandDataTypes';
import {ConsultantJobAssignCommandBus} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignCommandEnum} from '../../../aggregates/ConsultantJobAssign/types';
import {
  ProgressConsultantJobAssignCommandDataInterface,
  StartConsultantJobAssignCommandDataInterface,
  CompleteConsultantJobAssignCommandDataInterface,
  FailItemConsultantJobAssignCommandDataInterface
} from '../../../aggregates/ConsultantJobAssign/types/CommandDataTypes';
import {ConsultantJobAssignErrorItemEnum} from '../../../aggregates/ConsultantJobAssign/types/ConsultantJobAssignErrorItemEnum';
import {EventRepository} from '../../../EventRepository';
import {AgencyClientCommandBusFactory} from '../../../factories/AgencyClientCommandBusFactory';
import {ConsultantJobAssignCommandBusFactory} from '../../../factories/ConsultantJobAssignCommandBusFactory';

export class AggregateHelper {
  private consultantJobAssignCommandBus: ConsultantJobAssignCommandBus;
  private agencyClientCommandBus: AgencyClientCommandBus;
  constructor(private agencyId: string, private jobId: string, private eventRepository: EventRepository) {
    this.consultantJobAssignCommandBus = ConsultantJobAssignCommandBusFactory.getCommandBus(eventRepository);
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());

    this.agencyClientCommandBus = AgencyClientCommandBusFactory.getCommandBus(eventRepository, agencyRepository);
  }

  async startProcess(): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.START,
      data: {} as StartConsultantJobAssignCommandDataInterface
    });
  }
  async progressProcess(clientIds: string[]): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.PROGRESS,
      data: {
        count: clientIds.length,
        client_ids: clientIds
      } as ProgressConsultantJobAssignCommandDataInterface
    });
  }
  async completeProcess(): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.COMPLETE,
      data: {} as CompleteConsultantJobAssignCommandDataInterface
    });
  }
  async failItemProcess(
    clientId: string,
    errorCode: ConsultantJobAssignErrorItemEnum,
    errorMessage: string
  ): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
      data: {
        client_id: clientId,
        error_code: errorCode,
        error_message: errorMessage
      } as FailItemConsultantJobAssignCommandDataInterface
    });
  }
  async assignConsultantToClient(consultantRoleId: string, consultantId: string, clientId: string): Promise<void> {
    const id = new ObjectID().toString();

    await this.agencyClientCommandBus.execute(this.agencyId, clientId, {
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: id,
        consultant_role_id: consultantRoleId,
        consultant_id: consultantId
      } as AddAgencyClientConsultantCommandDataInterface
    });
  }
}
