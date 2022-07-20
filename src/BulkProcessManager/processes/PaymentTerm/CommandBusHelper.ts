import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {ClientInheritanceProcessCommandEnum} from '../../../aggregates/ClientInheritanceProcess/types';
import {
  StartClientInheritanceProcessCommandInterface,
  SucceedItemClientInheritanceProcessCommandInterface,
  CompleteClientInheritanceProcessCommandInterface,
  FailItemClientInheritanceProcessCommandInterface
} from '../../../aggregates/ClientInheritanceProcess/types/CommandTypes';
import {CommandBus} from '../../../aggregates/CommandBus';
import {PaymentTermCommandEnum} from '../../../aggregates/PaymentTerm/types';
import {
  ApplyPaymentTermCommandInterface,
  ApplyInheritedPaymentTermCommandInterface
} from '../../../aggregates/PaymentTerm/types/CommandTypes';

export class CommandBusHelper {
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

  async failItem(clientId: string, errors: EventStoreEncodedErrorInterface[]): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'client_inheritance_process',
        agency_id: this.agencyId,
        job_id: this.jobId
      },
      type: ClientInheritanceProcessCommandEnum.FAIL_ITEM_INHERITANCE_PROCESS,
      data: {
        client_id: clientId,
        errors
      }
    } as FailItemClientInheritanceProcessCommandInterface);
  }

  async applyInheritedPaymentTerm(clientId: string, term: string, force: boolean): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'payment_term',
        agency_id: this.agencyId,
        client_id: clientId
      },
      type: PaymentTermCommandEnum.APPLY_INHERITED_PAYMENT_TERM,
      data: {
        term,
        force
      }
    } as ApplyInheritedPaymentTermCommandInterface);
  }

  async completeProcess(): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'client_inheritance_process',
        agency_id: this.agencyId,
        job_id: this.jobId
      },
      type: ClientInheritanceProcessCommandEnum.COMPLETE_INHERITANCE_PROCESS,
      data: {}
    } as CompleteClientInheritanceProcessCommandInterface);
  }
}
