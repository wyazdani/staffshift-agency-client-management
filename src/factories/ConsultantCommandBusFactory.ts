import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjectionHandler';
import {AssignConsultantCommandHandler} from '../ConsultantJob/command-handlers/AssignConsultantCommandHandler';
import {ConsultantJobCommandBus} from '../ConsultantJob/ConsultantJobCommandBus';
import {ConsultantJobRepository} from '../ConsultantJob/ConsultantJobRepository';
import {ConsultantJobWriteProjectionHandler} from '../ConsultantJob/ConsultantJobWriteProjectionHandler';
import {EventRepository} from '../EventRepository';

export class ConsultantCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): ConsultantJobCommandBus {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const consultantRepository = new ConsultantJobRepository(
      eventRepository,
      new ConsultantJobWriteProjectionHandler(),
      agencyRepository
    );
    const commandBus = new ConsultantJobCommandBus();

    commandBus.addHandler(new AssignConsultantCommandHandler(consultantRepository));
    return commandBus;
  }
}
