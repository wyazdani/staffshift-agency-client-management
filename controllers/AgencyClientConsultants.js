'use strict';
const {AgencyClientConsultants} = require('../models');
const {get} = require('lodash');

/**
 * List Agency Client Consultants
 *
 * @param {ClientRequest} req - The http request object
 * @param {IncomingMessage} res - The http response object
 * @param {function} next - The callback used to pass control to the next action/middleware
 */
 module.exports.listAgencyClientConsultant = async (req, res, next) => {
  const agency_id = get(req, 'swagger.params.agency_id.value', '');
  const client_id = get(req, 'swagger.params.client_id.value', '');

  // Need to add query support and apply the correct headers
  try {
    let response = await AgencyClientConsultants.find({agency_id, client_id});

    if (response.length > 0) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(response));
    } else {
      res.statusCode = 204;
      res.end();
    }
  } catch (err) {
    // This needs to be centralised and done better
    console.log('ERR THERE WAS', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({message: err.message}));
  }
};