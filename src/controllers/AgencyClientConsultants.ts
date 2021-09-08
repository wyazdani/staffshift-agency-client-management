import {AgencyClientRepository} from "../AgencyClient/AgencyClientRepository";
import {EventStore} from "../models/EventStore";
import {AgencyClientCommandHandler} from "../AgencyClient/AgencyClientCommandHandler";
import _ from "lodash";
import {ClientRequest, ServerResponse} from 'http';

module.exports.addAgencyClientConsultant = async (req: ClientRequest, res: ServerResponse, next: Function): Promise<void> => {
  const payload = _.get(req, 'swagger.params.assign_client_consultant_payload.value', {});
  const agency_id = _.get(req, 'swagger.params.agency_id.value', '');
  const client_id = _.get(req, 'swagger.params.client_id.value', '');
  const command_type = _.get(req, 'swagger.operation.x-octophant-event', '');

  let repository = new AgencyClientRepository(EventStore);
  let handler = new AgencyClientCommandHandler(repository);

  // Decide how auth / audit data gets from here to the event in the event store.
  let command = {
    type: command_type,
    data: payload
  };

  try {
    // Passing in the agency and client ids here feels strange
    await handler.apply(agency_id, client_id, command);
    // This needs to be centralised and done better
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({status: 'completed'}));
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
}
