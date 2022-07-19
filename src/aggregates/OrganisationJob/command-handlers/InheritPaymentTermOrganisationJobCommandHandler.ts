import {EventsEnum} from '../../../Events';
import {InheritPaymentTermOrganisationJobCommandInterface} from '../types/CommandTypes';
import {OrganisationJobRepository} from '../OrganisationJobRepository';
import {OrganisationJobCommandHandlerInterface} from '../types/OrganisationJobCommandHandlerInterface';
import {OrganisationJobCommandEnum} from '../types';

export class InheritPaymentTermOrganisationJobCommandHandler implements OrganisationJobCommandHandlerInterface {
  constructor(private repository: OrganisationJobRepository) {}
  commandType: OrganisationJobCommandEnum.APPLY_PAYMENT_TERM;

  /**
   * when force is true, inherited events will be persisted, it means if the node is not inherited, then we will mark it as inherited
   * but if the force is false, it means we have to check if the node is inherited or no. if no throw an exception
   */
  async execute(command: InheritPaymentTermOrganisationJobCommandInterface): Promise<void> {
    const aggregate = await this.repository.getAggregate(command.aggregateId);

    const type = EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED;

    let eventId = aggregate.getLastSequenceId();

    await this.repository.save([
      {
        type,
        aggregate_id: aggregate.getId(),
        data: command.data,
        sequence_id: ++eventId
      }
    ]);
  }
}
