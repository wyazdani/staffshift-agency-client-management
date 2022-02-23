import {AgencyRepository} from '../Agency/AgencyRepository';
import {AgencyWriteProjectionHandler} from '../Agency/AgencyWriteProjectionHandler';
import {AssignConsultantCommandHandler} from '../Consultant/command-handlers/AssignConsultantCommandHandler';
import {ConsultantCommandBus} from '../Consultant/ConsultantCommandBus';
import {ConsultantRepository} from '../Consultant/ConsultantRepository';
import {ConsultantWriteProjectionHandler} from '../Consultant/ConsultantWriteProjectionHandler';
import {EventRepository} from '../EventRepository';

export class ConsultantCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): ConsultantCommandBus {
    const agencyRepository = new AgencyRepository(eventRepository, new AgencyWriteProjectionHandler());
    const consultantRepository = new ConsultantRepository(
      eventRepository,
      new ConsultantWriteProjectionHandler(),
      agencyRepository
    );
    const commandBus = new ConsultantCommandBus();

    commandBus.addHandler(new AssignConsultantCommandHandler(consultantRepository));
    return commandBus;
  }
}
