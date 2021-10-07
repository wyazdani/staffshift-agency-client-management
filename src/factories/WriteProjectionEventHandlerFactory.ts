import {AgencyClientEventEnum} from '../AgencyClient/types';
import {AgencyEventEnum} from '../Agency/types';
import {AgencyWriteProjection} from '../Agency/AgencyWriteProjection';
import {AgencyClientWriteProjection} from '../AgencyClient/AgencyClientWriteProjection';

export class WriteProjectionEventHandlerFactory {
  static getHandler(type: string): (acc: unknown, eventStoreDocument: unknown) => unknown {
    if (type in AgencyClientEventEnum) {
      return AgencyClientWriteProjection[type as AgencyClientEventEnum];
    }

    if (type in AgencyEventEnum) {
      return AgencyWriteProjection[type as AgencyEventEnum];
    }

    throw new Error(`No handler found for the given event type: ${type}`);
  }
}
