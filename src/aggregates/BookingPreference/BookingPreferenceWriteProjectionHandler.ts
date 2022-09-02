import {WriteProjectionInterface} from 'WriteProjectionInterface';
import {EventsEnum} from '../../Events';
import {EventStoreModelInterface} from '../../models/EventStore';
import {BookingPreferenceAggregateRecordInterface} from './types';

/**
 * Responsible for handling all events to build the current state of the aggregate
 */
export class BookingPreferenceWriteProjectionHandler
implements WriteProjectionInterface<BookingPreferenceAggregateRecordInterface> {
  execute(
    type: EventsEnum,
    aggregate: BookingPreferenceAggregateRecordInterface,
    event: EventStoreModelInterface
  ): BookingPreferenceAggregateRecordInterface {
    switch (type) {
      case EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET:
        aggregate.requires_po_number = true;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET:
        aggregate.requires_po_number = false;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET:
        aggregate.requires_shift_ref_number = true;
        break;
      case EventsEnum.AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_UNSET:
        aggregate.requires_shift_ref_number = false;
        break;
      default:
        throw new Error(`Event type not supported: ${type}`);
    }
    return {...aggregate, last_sequence_id: event.sequence_id};
  }
}
