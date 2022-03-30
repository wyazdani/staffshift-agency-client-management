import {AgencyRepository} from '../aggregates/Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../aggregates/Agency/AgencyWriteProjectionHandler';
import {AssignConsultantCommandHandler} from '../aggregates/ConsultantJob/command-handlers/AssignConsultantCommandHandler';
import {CompleteAssignConsultantCommandHandler} from '../aggregates/ConsultantJob/command-handlers/CompleteAssignConsultantCommandHandler';
import {ConsultantJobCommandBus} from '../aggregates/ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobRepository} from '../aggregates/ConsultantJob/ConsultantJobRepository';
import {ConsultantJobWriteProjectionHandler} from '../aggregates/ConsultantJob/ConsultantJobWriteProjectionHandler';
import {EventRepository} from '../EventRepository';

export class ConsultantJobCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): ConsultantJobCommandBus {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const consultantRepository = new ConsultantJobRepository(
      eventRepository,
      new ConsultantJobWriteProjectionHandler(),
      agencyRepository
    );
    const commandBus = new ConsultantJobCommandBus();

    commandBus
      .addHandler(new AssignConsultantCommandHandler(consultantRepository))
      .addHandler(new CompleteAssignConsultantCommandHandler(consultantRepository));
    return commandBus;
  }
}
