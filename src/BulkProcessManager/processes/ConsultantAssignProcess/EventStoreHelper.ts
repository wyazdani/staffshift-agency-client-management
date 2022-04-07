import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {ObjectID} from 'mongodb';
import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientCommandBus} from '../../../aggregates/AgencyClient/AgencyClientCommandBus';
import {AgencyClientCommandEnum} from '../../../aggregates/AgencyClient/types';
import {AddAgencyClientConsultantCommandDataInterface} from '../../../aggregates/AgencyClient/types/CommandDataTypes';
import {ConsultantJobCommandBus} from '../../../aggregates/ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobCommandEnum} from '../../../aggregates/ConsultantJob/types';
import {CompleteAssignConsultantCommandDataInterface} from '../../../aggregates/ConsultantJob/types/CommandDataTypes';
import {ConsultantJobAssignAggregate} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignAggregate';
import {ConsultantJobAssignCommandBus} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignRepository} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignWriteProjectionHandler} from '../../../aggregates/ConsultantJobAssign/ConsultantJobAssignWriteProjectionHandler';
import {ConsultantJobAssignCommandEnum} from '../../../aggregates/ConsultantJobAssign/types';
import {
  SucceedItemConsultantJobAssignCommandDataInterface,
  StartConsultantJobAssignCommandDataInterface,
  CompleteConsultantJobAssignCommandDataInterface,
  FailItemConsultantJobAssignCommandDataInterface
} from '../../../aggregates/ConsultantJobAssign/types/CommandDataTypes';
import {EventRepository} from '../../../EventRepository';
import {ConsultantJobAssignCommandBusFactory} from '../../../factories/ConsultantJobAssignCommandBusFactory';
import {ConsultantJobCommandBusFactory} from '../../../factories/ConsultantJobCommandBusFactory';

/**
 * Helper class to produce related events
 */
export class EventStoreHelper {
  private consultantJobAssignCommandBus: ConsultantJobAssignCommandBus;
  private agencyClientCommandBus: AgencyClientCommandBus;
  private consultantJobAssignRepository: ConsultantJobAssignRepository;
  private consultantJobCommandBus: ConsultantJobCommandBus;
  constructor(private agencyId: string, private jobId: string, private eventRepository: EventRepository) {
    this.consultantJobAssignCommandBus = ConsultantJobAssignCommandBusFactory.getCommandBus(eventRepository);
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());

    this.agencyClientCommandBus = AgencyClientCommandBusFactory.getCommandBus(eventRepository, agencyRepository);

    this.consultantJobAssignRepository = new ConsultantJobAssignRepository(
      eventRepository,
      new ConsultantJobAssignWriteProjectionHandler()
    );

    this.consultantJobCommandBus = ConsultantJobCommandBusFactory.getCommandBus(eventRepository);
  }

  async startProcess(): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.START,
      data: {} as StartConsultantJobAssignCommandDataInterface
    });
  }

  async succeedItemProcess(clientId: string): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.SUCCEED_ITEM,
      data: {
        client_id: clientId
      } as SucceedItemConsultantJobAssignCommandDataInterface
    });
  }

  async completeProcess(): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.COMPLETE,
      data: {} as CompleteConsultantJobAssignCommandDataInterface
    });
  }

  async failItemProcess(clientId: string, errors: EventStoreEncodedErrorInterface[]): Promise<void> {
    await this.consultantJobAssignCommandBus.execute(this.agencyId, this.jobId, {
      type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
      data: {
        client_id: clientId,
        errors
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

  async getConsultantJobAssignAggregate(agencyId: string, jobId: string): Promise<ConsultantJobAssignAggregate> {
    return await this.consultantJobAssignRepository.getAggregate(agencyId, jobId);
  }

  async completeConsultantJob(agencyId: string, jobId: string): Promise<void> {
    await this.consultantJobCommandBus.execute(agencyId, {
      data: {_id: jobId} as CompleteAssignConsultantCommandDataInterface,
      type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT
    });
  }
}
