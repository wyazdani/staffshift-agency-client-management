
const AgencyClientConsultant = require('./AgencyClientConsultant/watch');
const AgencyClientsProjection = require('./AgencyClientsProjection/watch');
const AgencyClientEventLogProjection = require('./AgencyClientEventLogProjection/watch');
const watcherListing = [AgencyClientConsultant, AgencyClientsProjection, AgencyClientEventLogProjection];
export default watcherListing;