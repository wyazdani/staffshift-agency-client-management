import {find, indexOf} from 'lodash';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {ConsultantAggregateIdInterface, ConsultantAggregateRecordInterface} from './types';
import {AssignConsultantCommandDataInterface} from './types/CommandDataTypes';
import {ValidationError} from 'a24-node-error-utils';

export class ConsultantAggregate {
  constructor(
    private id: ConsultantAggregateIdInterface,
    private aggregate: ConsultantAggregateRecordInterface,
    private agencyRepository: AgencyRepository
  ) {}

  /**
   * checks:
   * - consultant role id existence
   * - consultant role enabled
   * - we don't have another job running for the same consultant
   */
  async validateAssignConsultant(command: AssignConsultantCommandDataInterface): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate(this.id.agency_id);
    const consultantRole = agencyAggregate.getConsultantRole(command.consultant_role_id);

    if (!consultantRole) {
      throw new ValidationError('Not allowed consultant role', [
        {
          code: 'CONSULTANT_ROLE_NOT_FOUND',
          message: `Consultant role ${command.consultant_role_id} does not not exist`,
          path: ['consultant_role_id']
        }
      ]);
    }
    if (consultantRole.status !== 'enabled') {
      throw new ValidationError('Not allowed consultant role', [
        {
          code: 'CONSULTANT_ROLE_NOT_ENABLED',
          message: `Consultant role ${command.consultant_role_id} is not enabled`,
          path: ['consultant_role_id']
        }
      ]);
    }
    const process = find(
      this.aggregate.processes,
      (process) => process.status !== 'completed' && indexOf(process.consultants, command.consultant_id) >= 0
    );

    if (process) {
      throw new ValidationError('Not allowed consultant', [
        {
          code: 'ANOTHER_CONSULTANT_PROCESS_ACTIVE',
          message: `There is another job still running for this consultant id ${command.consultant_id}`,
          path: ['consultant_id']
        }
      ]);
    }
  }

  /**
   * Return the aggregate ID
   */
  getId(): ConsultantAggregateIdInterface {
    return this.id;
  }

  /**
   * Return the previous aggregate ID
   */
  getLastEventId(): number {
    return this.aggregate.last_sequence_id;
  }

  // Base class method for all aggregates
  toJSON(): ConsultantAggregateRecordInterface {
    return this.aggregate;
  }
}
