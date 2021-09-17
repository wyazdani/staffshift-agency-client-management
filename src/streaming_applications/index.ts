import * as AgencyClientConsultant from './AgencyClientConsultant/watch';
import * as AgencyClientsProjection from './AgencyClientsProjection/watch';
import * as AgencyClientEventLogProjection from './AgencyClientEventLogProjection/watch';
const watcherListing = [AgencyClientConsultant, AgencyClientsProjection, AgencyClientEventLogProjection];
export default watcherListing;