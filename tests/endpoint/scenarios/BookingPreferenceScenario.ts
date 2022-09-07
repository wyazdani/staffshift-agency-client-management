import {BookingPreferenceCommandEnum} from '../../../src/aggregates/BookingPreference/types';
import {
  SetRequiresBookingPasswordCommandInterface,
  SetRequiresPONumberCommandInterface,
  SetRequiresUniquePONumberCommandInterface
} from '../../../src/aggregates/BookingPreference/types/CommandTypes';
import {EventsEnum} from '../../../src/Events';
import {AbstractScenario} from './AbstractScenario';

export class BookingPreferenceScenario extends AbstractScenario {
  async setRequiresPONumber(agencyId: string, clientId: string): Promise<void> {
    const command: SetRequiresPONumberCommandInterface = {
      type: BookingPreferenceCommandEnum.SET_REQUIRES_PO_NUMBER,
      data: {},
      aggregateId: {
        name: 'booking_preference',
        client_id: clientId,
        agency_id: agencyId
      }
    };

    await this.commandBus.execute(command);
  }

  async setRequiresBookingPassword(agencyId: string, clientId: string): Promise<void> {
    const command: SetRequiresBookingPasswordCommandInterface = {
      type: BookingPreferenceCommandEnum.SET_REQUIRES_BOOKING_PASSWORD,
      data: {
        booking_passwords: ['test']
      },
      aggregateId: {
        name: 'booking_preference',
        client_id: clientId,
        agency_id: agencyId
      }
    };

    await this.commandBus.execute(command);
  }

  async setRequiresUniquePONumber(agencyId: string, clientId: string): Promise<void> {
    const command: SetRequiresUniquePONumberCommandInterface = {
      type: BookingPreferenceCommandEnum.SET_REQUIRES_UNIQUE_PO_NUMBER,
      data: {},
      aggregateId: {
        name: 'booking_preference',
        client_id: clientId,
        agency_id: agencyId
      }
    };

    await this.commandBus.execute(command);
  }
}
