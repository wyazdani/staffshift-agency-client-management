import {CompleteConsultantJobAssignCommandHandler} from '../aggregates/ConsultantJobAssign/command-handlers/CompleteConsultantJobAssignCommandHandler';
import {FailItemConsultantJobAssignCommandHandler} from '../aggregates/ConsultantJobAssign/command-handlers/FailItemConsultantJobAssignCommandHandler';
import {SucceedItemConsultantJobAssignCommandHandler} from '../aggregates/ConsultantJobAssign/command-handlers/SucceedItemConsultantJobAssignCommandHandler';
import {StartConsultantJobAssignCommandHandler} from '../aggregates/ConsultantJobAssign/command-handlers/StartConsultantJobAssignCommandHandler';
import {ConsultantJobAssignCommandBus} from '../aggregates/ConsultantJobAssign/ConsultantJobAssignCommandBus';
import {ConsultantJobAssignRepository} from '../aggregates/ConsultantJobAssign/ConsultantJobAssignRepository';
import {ConsultantJobAssignWriteProjectionHandler} from '../aggregates/ConsultantJobAssign/ConsultantJobAssignWriteProjectionHandler';
import {EventRepository} from '../EventRepository';

export class ConsultantJobAssignCommandBusFactory {
  static getCommandBus(eventRepository: EventRepository): ConsultantJobAssignCommandBus {
    const repository = new ConsultantJobAssignRepository(
      eventRepository,
      new ConsultantJobAssignWriteProjectionHandler()
    );
    const commandBus = new ConsultantJobAssignCommandBus();

    commandBus
      .addHandler(new StartConsultantJobAssignCommandHandler(repository))
      .addHandler(new SucceedItemConsultantJobAssignCommandHandler(repository))
      .addHandler(new FailItemConsultantJobAssignCommandHandler(repository))
      .addHandler(new CompleteConsultantJobAssignCommandHandler(repository));
    return commandBus;
  }
}
