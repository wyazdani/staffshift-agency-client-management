import {AgencyClientEventEnum} from '../AgencyClient/types';
import {AgencyEventEnum} from '../Agency/types';
import {AgencyWriteProjection} from '../Agency/AgencyWriteProjection';
import {AgencyClientWriteProjection} from '../AgencyClient/AgencyClientWriteProjection';

export class WriteProjectionEventHandlerFactory {
  static getHandler(type: string): (acc: unknown, eventStoreDocument: unknown) => unknown {
    if ((Object.values(AgencyClientEventEnum) as string[]).includes(type)) {
      return AgencyClientWriteProjection[type as AgencyClientEventEnum];
    }

    if ((Object.values(AgencyEventEnum) as string[]).includes(type)) {
      return AgencyWriteProjection[type as AgencyEventEnum];
    }

    throw new Error(`No handler found for the given event type: ${type}`);
  }
}
