'use strict';
const AgencyClientConsultant = require('./AgencyClientConsultant/watch');
const AgencyClientProjection = require('./AgencyClientProjection/watch');
const AgencyClientEventLogProjection = require('./AgencyClientEventLogProjection/watch');
const watcherListing = [AgencyClientConsultant, AgencyClientProjection, AgencyClientEventLogProjection];

module.exports = watcherListing;