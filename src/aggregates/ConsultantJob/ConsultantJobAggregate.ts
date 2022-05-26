import {find, indexOf} from 'lodash';
import {AgencyRepository} from '../Agency/AgencyRepository';
import {ConsultantJobAggregateIdInterface, ConsultantJobAggregateRecordInterface} from './types';
import {
  AssignConsultantCommandDataInterface,
  UnassignConsultantCommandDataInterface,
  TransferConsultantCommandDataInterface
} from './types/CommandDataTypes';
import {ValidationError} from 'a24-node-error-utils';
import {AbstractAggregate} from '../AbstractAggregate';

export class ConsultantJobAggregate extends AbstractAggregate<
  ConsultantJobAggregateIdInterface,
  ConsultantJobAggregateRecordInterface
> {
  constructor(
    protected id: ConsultantJobAggregateIdInterface,
    protected aggregate: ConsultantJobAggregateRecordInterface,
    private agencyRepository: AgencyRepository
  ) {
    super(id, aggregate);
  }

  /**
   * checks:
   * - consultant role id existence
   * - consultant role enabled
   * - we don't have another job running for the same consultant
   */
  async validateAssignConsultant(command: AssignConsultantCommandDataInterface): Promise<void> {
    const agencyAggregate = await this.agencyRepository.getAggregate({agency_id: this.id.agency_id});
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
    this.validateNotRunningAnotherProcess(command.consultant_id);
  }

  validateCompleteJob(processId: string): boolean {
    return !!find(this.aggregate.processes, {_id: processId, status: 'initiated'});
  }

  validateUnassignConsultant(command: UnassignConsultantCommandDataInterface): void {
    this.validateNotRunningAnotherProcess(command.consultant_id);
  }
  validateTransferConsultant(command: TransferConsultantCommandDataInterface): void {
    if (command.from_consultant_id === command.to_consultant_id) {
      throw new ValidationError('from consultant and to consultant should be different', [
        {
          code: 'SAME_CONSULTANT',
          message: 'We can not transfer clients from a consultant to the same consultant',
          path: ['from_consultant_id']
        }
      ]);
    }
    this.validateNotRunningAnotherProcess(command.from_consultant_id);
    this.validateNotRunningAnotherProcess(command.to_consultant_id);
  }

  private validateNotRunningAnotherProcess(consultantId: string) {
    const process = find(
      this.aggregate.processes,
      (process) => process.status !== 'completed' && indexOf(process.consultants, consultantId) >= 0
    );

    if (process) {
      throw new ValidationError('Not allowed consultant', [
        {
          code: 'ANOTHER_CONSULTANT_PROCESS_ACTIVE',
          message: `There is another job still running for this consultant id ${consultantId}`,
          path: ['consultant_id']
        }
      ]);
    }
  }
}
