import {Transform, TransformOptions} from 'stream';
import {AgencyRepository} from '../../../Agency/AgencyRepository';
import {Events} from '../../../Events';
import {CallbackError, Model} from 'mongoose';
import {LoggerContext} from 'a24-logzio-winston';

const events = [
  Events.AGENCY_CLIENT_CONSULTANT_ASSIGNED,
  Events.AGENCY_CLIENT_CONSULTANT_UNASSIGNED,
  Events.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED
];
interface options extends TransformOptions {
  eventstore: Model<any>,
  model: Model<any>,
  pipeline: string,
  logger: LoggerContext
}

export class AgencyClientConsultantProjection extends Transform {
  private readonly eventstore: Model<any>;
  private model: Model<any>;
  private pipeline: string;
  private logger: LoggerContext;
  constructor(opts: options) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.eventstore = opts.eventstore;
    this.model = opts.model;
    this.pipeline = opts.pipeline;
    this.logger = opts.logger;
  }

  _transform(data: any, encoding: any, callback: Function) {
    if (!events.includes(data.event.type)) {
      return callback(null, data);
    }
    const event = data.event;
    if (Events.AGENCY_CLIENT_CONSULTANT_ASSIGNED === data.event.type) {
      // if the UI does the legend stitching we dont do this work
      // NOR do we care about any updates to the actual name
      const repository = new AgencyRepository(this.eventstore);
      repository.getAggregate(event.aggregate_id.agency_id)
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
          agencyClientConsultant.save((err: Error) => {
            return callback(err, data);
          });
        })
        .catch((err) => {
          return callback(err);
        });
    } else if (Events.AGENCY_CLIENT_CONSULTANT_UNASSIGNED === data.event.type) {
      this.model.remove({_id: event.data._id}, (err) => {
        return callback(err, data);
      });
    } else if (Events.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED === data.event.type && event.data.name) {
      this.model.updateMany({consultant_role_id: event.data._id},
        {$set: {consultant_role_name: event.data.name}}, {},
        (err: CallbackError) => {
          return callback(err, data);
        });
    }
    // Should we be adding something here since this is a possible "hanging" issue
  }
}