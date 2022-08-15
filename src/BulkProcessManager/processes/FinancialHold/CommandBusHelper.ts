import {EventStoreEncodedErrorInterface} from 'EventStoreEncodedErrorInterface';
import {ClientInheritanceProcessCommandEnum} from '../../../aggregates/ClientInheritanceProcess/types';
import {
  StartClientInheritanceProcessCommandInterface,
  SucceedItemClientInheritanceProcessCommandInterface,
  CompleteClientInheritanceProcessCommandInterface,
  FailItemClientInheritanceProcessCommandInterface
} from '../../../aggregates/ClientInheritanceProcess/types/CommandTypes';
import {CommandBus} from '../../../aggregates/CommandBus';
import {FinancialHoldCommandEnum} from '../../../aggregates/FinancialHold/types';
import {
  SetFinancialHoldCommandInterface,
  SetInheritedFinancialHoldCommandInterface
} from '../../../aggregates/FinancialHold/types/CommandTypes';

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

  async setFinancialHold(clientId: string, financial_hold: boolean, note: string): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'financial_hold',
        agency_id: this.agencyId,
        client_id: clientId
      },
      type: FinancialHoldCommandEnum.SET_FINANCIAL_HOLD,
      data: {financial_hold, note}
    } as SetFinancialHoldCommandInterface);
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

  async setInheritedFinancialHold(
    clientId: string,
    financialHold: boolean,
    note: string,
    force: boolean
  ): Promise<void> {
    await this.commandBus.execute({
      aggregateId: {
        name: 'financial_hold',
        agency_id: this.agencyId,
        client_id: clientId
      },
      type: FinancialHoldCommandEnum.SET_INHERITED_FINANCIAL_HOLD,
      data: {
        financial_hold: financialHold,
        note,
        force
      }
    } as SetInheritedFinancialHoldCommandInterface);
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
