import {AgencyRepository} from '../../../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../../../aggregates/Agency/AgencyWriteProjectionHandler';
import {AgencyClientRepository} from '../../../aggregates/AgencyClient/AgencyClientRepository';
import {AgencyClientWriteProjectionHandler} from '../../../aggregates/AgencyClient/AgencyClientWriteProjectionHandler';
import {
  ClientInheritanceProcessRepository
} from '../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessRepository';
import {
  ClientInheritanceProcessWriteProjectionHandler
} from '../../../aggregates/ClientInheritanceProcess/ClientInheritanceProcessWriteProjectionHandler';
import {
  ClientInheritanceProcessAggregateIdInterface,
  ClientInheritanceProcessCommandEnum
} from '../../../aggregates/ClientInheritanceProcess/types';
import {
  StartClientInheritanceProcessCommandInterface,
  SucceedItemClientInheritanceProcessCommandInterface
} from '../../../aggregates/ClientInheritanceProcess/types/CommandTypes';
import {CommandBus} from '../../../aggregates/CommandBus';
import {PaymentTermAggregateIdInterface, PaymentTermCommandEnum} from '../../../aggregates/PaymentTerm/types';
import {ApplyPaymentTermCommandInterface} from '../../../aggregates/PaymentTerm/types/CommandTypes';
import {EventRepository} from '../../../EventRepository';

export class CommandBusHelper {
  private agencyClientRepository: AgencyClientRepository;
  private processRepository: ClientInheritanceProcessRepository;
  constructor(private commandBus: CommandBus, private agencyId: string, private jobId: string) {}
  async startProcess(estimatedCount: number): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'client_inheritance_process',
        agency_id: this.agencyId,
        job_id: this.jobId
      },
      type: ClientInheritanceProcessCommandEnum.START_INHERITANCE_PROCESS,
      data: {
        estimated_count: estimatedCount
      }
    } as StartClientInheritanceProcessCommandInterface);
  }

  async applyPaymentTerm(clientId: string, term: string): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'payment_term',
        agency_id: this.agencyId,
        client_id: clientId
      },
      type: PaymentTermCommandEnum.APPLY_PAYMENT_TERM,
      data: {term}
    } as ApplyPaymentTermCommandInterface);
  }

  async succeedItem(clientId: string): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'client_inheritance_process',
        agency_id: this.agencyId,
        job_id: this.jobId
      },
      type: ClientInheritanceProcessCommandEnum.SUCCEED_ITEM_INHERITANCE_PROCESS,
      data: {
        client_id: clientId
      }
    } as SucceedItemClientInheritanceProcessCommandInterface);
  }

}
