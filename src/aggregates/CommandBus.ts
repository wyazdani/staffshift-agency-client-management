import {ObjectID} from 'mongodb';
import {EventRepository} from '../EventRepository';
import {AgencyCommandBus} from './Agency/AgencyCommandBus';
import {AgencyClientCommandBus} from './AgencyClient/AgencyClientCommandBus';
import {AgencyClientAggregateIdInterface, AgencyClientCommandEnum} from './AgencyClient/types';
import {AddAgencyClientConsultantCommandInterface} from './AgencyClient/types/CommandTypes';
import {ConsultantJobCommandBus} from './ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobAggregateIdInterface, ConsultantJobCommandEnum} from './ConsultantJob/types';
import {CompleteAssignConsultantCommandInterface} from './ConsultantJob/types/CommandTypes';
import {ConsultantJobAssignCommandBus} from './ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignCommandEnum, ConsultantJobAssignAggregateIdInterface} from './ConsultantJobAssign/types';
import {FailItemConsultantJobAssignCommandDataInterface} from './ConsultantJobAssign/types/CommandDataTypes';
import {
  StartConsultantJobAssignCommandInterface,
  SucceedItemConsultantJobAssignCommandInterface,
  CompleteConsultantJobAssignCommandInterface,
  FailItemConsultantJobAssignCommandInterface
} from './ConsultantJobAssign/types/CommandTypes';
import {AggregateCommandInterface, AggregateCommandHandlerInterface} from './types';

export class CommandBus {
  private _commandRegistry: {[key: string]: AggregateCommandHandlerInterface} = {};

  constructor(eventRepository: EventRepository) {
    AgencyCommandBus.registerCommandHandlers(eventRepository, this);
    AgencyClientCommandBus.registerCommandHandlers(eventRepository, this);
    ConsultantJobCommandBus.registerCommandHandlers(eventRepository, this);
    ConsultantJobAssignCommandBus.registerCommandHandlers(eventRepository, this);
  }

  registerAggregateCommand(cmd: AggregateCommandHandlerInterface): void {
    if (this._commandRegistry[cmd.commandType]) {
      throw new Error(`Duplicate command type registered, ${cmd.commandType} already exists`);
    }
    this._commandRegistry[cmd.commandType] = cmd;
  }

  async execute(cmd: AggregateCommandInterface): Promise<void> {
    if (!this._commandRegistry[cmd.type]) {
      throw new Error(`Command type: ${cmd.type} has not been registered`);
    }
    return this._commandRegistry[cmd.type].execute(cmd);
  }

  /**
   * Commands:
   * We define some methods here to make code much easier to read in places where we have some business logic
   * It's up to you to decide if you want to define the function here or call `execute`
   * directly in you code.
   */

  async startConsultantJobAssign(aggregateId: ConsultantJobAssignAggregateIdInterface): Promise<void> {
    const command: StartConsultantJobAssignCommandInterface = {
      aggregateId: aggregateId,
      type: ConsultantJobAssignCommandEnum.START,
      data: {}
    };

    await this.execute(command);
  }

  async succeedItemConsultantJobAssign(
    aggregateId: ConsultantJobAssignAggregateIdInterface,
    clientId: string
  ): Promise<void> {
    const command: SucceedItemConsultantJobAssignCommandInterface = {
      aggregateId: aggregateId,
      type: ConsultantJobAssignCommandEnum.SUCCEED_ITEM,
      data: {
        client_id: clientId
      }
    };

    await this.execute(command);
  }

  async completeConsultantJobAssign(aggregateId: ConsultantJobAssignAggregateIdInterface): Promise<void> {
    const command: CompleteConsultantJobAssignCommandInterface = {
      aggregateId,
      type: ConsultantJobAssignCommandEnum.COMPLETE,
      data: {}
    };

    await this.execute(command);
  }

  async failItemConsultantJobAssign(
    aggregateId: ConsultantJobAssignAggregateIdInterface,
    data: FailItemConsultantJobAssignCommandDataInterface
  ): Promise<void> {
    const command: FailItemConsultantJobAssignCommandInterface = {
      aggregateId,
      type: ConsultantJobAssignCommandEnum.FAIL_ITEM,
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

  private generateId(): string {
    return new ObjectID().toString();
  }
}
