import {ConsultantCommandBus} from '../Consultant/ConsultantCommandBus';
import {ConsultantRepository} from '../Consultant/ConsultantRepository';
import {ConsultantWriteProjectionHandler} from '../Consultant/ConsultantWriteProjectionHandler';
import {EventRepository} from '../EventRepository';

export class ConsultantCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): ConsultantCommandBus {
    const consultantRepository = new ConsultantRepository(eventRepository, new ConsultantWriteProjectionHandler());
    const commandBus = new ConsultantCommandBus();

    //
    // commandBus
    //   .addHandler(new AddAgencyConsultantRoleCommandHandler(agencyRepository));
    return commandBus;
  }
}
