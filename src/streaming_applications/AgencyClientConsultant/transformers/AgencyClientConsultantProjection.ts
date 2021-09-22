import {Transform, TransformCallback, TransformOptions} from 'stream';
import {AgencyRepository} from '../../../Agency/AgencyRepository';
import {EventsEnum} from '../../../Events';
import {CallbackError, Model} from 'mongoose';
import {LoggerContext} from 'a24-logzio-winston';
import {GenericObjectInterface} from 'GenericObjectInterface';
import {EventRepository} from '../../../EventRepository';

const events = [
  EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
  EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];

interface OptionsInterface extends TransformOptions {
  eventRepository: EventRepository;
  model: Model<any>;
  pipeline: string;
  logger: typeof LoggerContext;
}

export class AgencyClientConsultantProjection extends Transform {
  private readonly eventRepository: EventRepository;
  private model: Model<any>;
  private pipeline: string;
  private logger: typeof LoggerContext;
  constructor(opts: OptionsInterface) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventRepository = opts.eventRepository;
    this.model = opts.model;
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
  }

  _transform(data: GenericObjectInterface, encoding: BufferEncoding, callback: TransformCallback): void {
    if (!events.includes(data.event.type)) {
      this.logger.debug('Incoming event ignored', {event: data.event.type});

      return callback(null, data);
    }
    this.logger.debug('Processing the incoming event', {event: data.event.type});
    const event = data.event;

    if (EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED === data.event.type) {
      // if the UI does the legend stitching we dont do this work
      // NOR do we care about any updates to the actual name
      const repository = new AgencyRepository(this.eventRepository);

      repository
        .getAggregate(event.aggregate_id.agency_id)
        .then((agencyAggregate) => {
          const role = agencyAggregate.getConsultantRole(event.data.consultant_role_id);
          const agencyClientConsultant = new this.model({
            _id: event.data._id,
            agency_id: event.aggregate_id.agency_id,
            client_id: event.aggregate_id.client_id,
            consultant_role_id: event.data.consultant_role_id,
            consultant_role_name: role.name,
            consultant_id: event.data.consultant_id
          });

          agencyClientConsultant.save((err: Error) => callback(err, data));
        })
        .catch((err) => callback(err));
    } else if (EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED === data.event.type) {
      this.model.remove({_id: event.data._id}, (err) => callback(err, data));
    } else if (EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED === data.event.type && event.data.name) {
      this.model.updateMany(
        {consultant_role_id: event.data._id},
        {$set: {consultant_role_name: event.data.name}},
        {},
        (err: CallbackError) => callback(err, data)
      );
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}
