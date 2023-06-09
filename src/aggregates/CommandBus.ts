import {ObjectId} from 'mongodb';
import {EventRepository} from '../EventRepository';
import {AgencyCommandBus} from './Agency/AgencyCommandBus';
import {AgencyClientCommandBus} from './AgencyClient/AgencyClientCommandBus';
import {AgencyClientAggregateIdInterface, AgencyClientCommandEnum} from './AgencyClient/types';
import {TransferAgencyClientConsultantCommandDataInterface} from './AgencyClient/types/CommandDataTypes';
import {
  AddAgencyClientConsultantCommandInterface,
  RemoveAgencyClientConsultantCommandInterface,
  TransferAgencyClientConsultantCommandInterface
} from './AgencyClient/types/CommandTypes';
import {BookingPreferenceCommandBus} from './BookingPreference/BookingPreferenceCommandBus';
import {ClientInheritanceProcessCommandBus} from './ClientInheritanceProcess/ClientInheritanceProcessCommandBus';
import {ConsultantJobCommandBus} from './ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobAggregateIdInterface, ConsultantJobCommandEnum} from './ConsultantJob/types';
import {
  CompleteAssignConsultantCommandInterface,
  CompleteUnassignConsultantCommandInterface,
  CompleteTransferConsultantCommandInterface
} from './ConsultantJob/types/CommandTypes';
import {ConsultantJobProcessCommandBus} from './ConsultantJobProcess/ConsultantJobProcessCommandBus';
import {ConsultantJobProcessCommandEnum, ConsultantJobProcessAggregateIdInterface} from './ConsultantJobProcess/types';
import {
  FailItemConsultantJobProcessCommandDataInterface,
  SucceedItemConsultantJobProcessCommandDataInterface
} from './ConsultantJobProcess/types/CommandDataTypes';
import {
  StartConsultantJobProcessCommandInterface,
  SucceedItemConsultantJobProcessCommandInterface,
  CompleteConsultantJobProcessCommandInterface,
  FailItemConsultantJobProcessCommandInterface
} from './ConsultantJobProcess/types/CommandTypes';
import {FinancialHoldCommandBus} from './FinancialHold/FinancialHoldCommandBus';
import {OrganisationJobCommandBus} from './OrganisationJob/OrganisationJobCommandBus';
import {PaymentTermCommandBus} from './PaymentTerm/PaymentTermCommandBus';
import {AggregateCommandInterface, AggregateCommandHandlerInterface} from './types';
import CommandSchemas from './command-schemas';
import ZSchema from 'z-schema';
import {CommandValidationError} from '../errors/CommandValidationError';
import {LoggerContext} from 'a24-logzio-winston';

export class CommandBus {
  private _commandRegistry: {[key: string]: AggregateCommandHandlerInterface} = {};

  constructor(eventRepository: EventRepository, private logger: LoggerContext) {
    this.registerAggregateCommandHandlers(AgencyCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(AgencyClientCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(ConsultantJobCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(ConsultantJobProcessCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(PaymentTermCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(ClientInheritanceProcessCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(OrganisationJobCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(FinancialHoldCommandBus.getCommandHandlers(eventRepository));
    this.registerAggregateCommandHandlers(BookingPreferenceCommandBus.getCommandHandlers(eventRepository));
  }

  private registerAggregateCommandHandlers(handlers: AggregateCommandHandlerInterface[]): void {
    for (const handler of handlers) {
      if (this._commandRegistry[handler.commandType]) {
        throw new Error(`Duplicate command type registered, ${handler.commandType} already exists`);
      }
      this._commandRegistry[handler.commandType] = handler;
    }
  }

  async execute(cmd: AggregateCommandInterface): Promise<number> {
    if (!this._commandRegistry[cmd.type]) {
      throw new Error(`Command type: ${cmd.type} has not been registered`);
    }

    const schema = CommandSchemas[cmd.type];

    if (!schema) {
      throw new Error(`Could not find json schema to validate command ${cmd.type}`);
    }
    const zSchema = new ZSchema({});
    const valid = zSchema.validate(cmd.data, schema);

    if (!valid) {
      this.logger.debug('Error from Command Validator', {errors: JSON.stringify(zSchema.getLastErrors())});
      throw new CommandValidationError(`Command Schema Validation Failed: ${cmd.type}`).setSchemaErrors(
        zSchema.getLastErrors()
      );
    }

    return this._commandRegistry[cmd.type].execute(cmd);
  }

  /**
   * Commands:
   * We define some methods here to make code much easier to read in places where we have some business logic
   * It's up to you to decide if you want to define the function here or call `execute`
   * directly in you code.
   */

  async startConsultantJobProcess(
    aggregateId: ConsultantJobProcessAggregateIdInterface,
    estimatedCount: number
  ): Promise<void> {
    const command: StartConsultantJobProcessCommandInterface = {
      aggregateId: aggregateId,
      type: ConsultantJobProcessCommandEnum.START,
      data: {
        estimated_count: estimatedCount
      }
    };

    await this.execute(command);
  }

  async succeedItemConsultantJobProcess(
    aggregateId: ConsultantJobProcessAggregateIdInterface,
    data: SucceedItemConsultantJobProcessCommandDataInterface
  ): Promise<void> {
    const command: SucceedItemConsultantJobProcessCommandInterface = {
      aggregateId: aggregateId,
      type: ConsultantJobProcessCommandEnum.SUCCEED_ITEM,
      data
    };

    await this.execute(command);
  }

  async completeConsultantJobProcess(aggregateId: ConsultantJobProcessAggregateIdInterface): Promise<void> {
    const command: CompleteConsultantJobProcessCommandInterface = {
      aggregateId,
      type: ConsultantJobProcessCommandEnum.COMPLETE,
      data: {}
    };

    await this.execute(command);
  }

  async failItemConsultantJobProcess(
    aggregateId: ConsultantJobProcessAggregateIdInterface,
    data: FailItemConsultantJobProcessCommandDataInterface
  ): Promise<void> {
    const command: FailItemConsultantJobProcessCommandInterface = {
      aggregateId,
      type: ConsultantJobProcessCommandEnum.FAIL_ITEM,
      data
    };

    await this.execute(command);
  }

  async addAgencyClientConsultant(
    aggregateId: AgencyClientAggregateIdInterface,
    consultantRoleId: string,
    consultantId: string
  ): Promise<void> {
    const command: AddAgencyClientConsultantCommandInterface = {
      aggregateId,
      type: AgencyClientCommandEnum.ADD_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: this.generateId(),
        consultant_role_id: consultantRoleId,
        consultant_id: consultantId
      }
    };

    await this.execute(command);
  }

  async completeAssignConsultant(aggregateId: ConsultantJobAggregateIdInterface, id: string): Promise<void> {
    const command: CompleteAssignConsultantCommandInterface = {
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_ASSIGN_CONSULTANT,
      data: {_id: id}
    };

    await this.execute(command);
  }

  async removeAgencyClientConsultant(
    aggregateId: AgencyClientAggregateIdInterface,
    assignmentId: string
  ): Promise<void> {
    const command: RemoveAgencyClientConsultantCommandInterface = {
      aggregateId,
      type: AgencyClientCommandEnum.REMOVE_AGENCY_CLIENT_CONSULTANT,
      data: {
        _id: assignmentId
      }
    };

    await this.execute(command);
  }

  async completeUnassignConsultant(aggregateId: ConsultantJobAggregateIdInterface, processId: string): Promise<void> {
    const command: CompleteUnassignConsultantCommandInterface = {
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_UNASSIGN_CONSULTANT,
      data: {_id: processId}
    };

    await this.execute(command);
  }

  async transferAgencyClientConsultant(
    aggregateId: AgencyClientAggregateIdInterface,
    commandData: TransferAgencyClientConsultantCommandDataInterface
  ): Promise<void> {
    const command: TransferAgencyClientConsultantCommandInterface = {
      aggregateId,
      type: AgencyClientCommandEnum.TRANSFER_AGENCY_CLIENT_CONSULTANT,
      data: commandData
    };

    await this.execute(command);
  }

  async completeTransferConsultant(aggregateId: ConsultantJobAggregateIdInterface, processId: string): Promise<void> {
    const command: CompleteTransferConsultantCommandInterface = {
      aggregateId,
      type: ConsultantJobCommandEnum.COMPLETE_TRANSFER_CONSULTANT,
      data: {_id: processId}
    };

    await this.execute(command);
  }

  private generateId(): string {
    return new ObjectId().toString();
  }
}
