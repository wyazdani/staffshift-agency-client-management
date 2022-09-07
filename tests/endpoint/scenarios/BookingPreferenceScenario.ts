import {AbstractScenario} from './AbstractScenario';
import {BookingPreferenceCommandEnum} from '../../../src/aggregates/BookingPreference/types';
import {SetRequiresShiftRefNumberCommandInterface} from '../../../src/aggregates/BookingPreference/types/CommandTypes';

export class BookingPreferenceScenario extends AbstractScenario {
  async setRequiresShiftRefNumber(agencyId: string, clientId: string): Promise<void> {
    const command: SetRequiresShiftRefNumberCommandInterface = {
      aggregateId: {
        name: 'booking_preference',
        agency_id: agencyId,
        client_id: clientId
      },
      type: BookingPreferenceCommandEnum.SET_REQUIRES_SHIFT_REF_NUMBER,
      data: {}
    };

    await this.commandBus.execute(command);
  }
}
