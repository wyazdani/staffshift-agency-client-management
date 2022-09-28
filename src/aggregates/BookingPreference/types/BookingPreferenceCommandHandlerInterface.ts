import {BookingPreferenceCommandInterface} from './BookingPreferenceCommandInterface';

export interface BookingPreferenceCommandHandlerInterface {
  commandType: string;
  execute(command: BookingPreferenceCommandInterface): Promise<number>;
}
