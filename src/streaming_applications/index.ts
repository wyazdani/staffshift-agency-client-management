import AgencyClientConsultantProjection from './AgencyClientConsultantProjection/watch';
import AgencyClientsProjection from './AgencyClientsProjection/watch';
import AgencyClientEventLogProjection from './AgencyClientEventLogProjection/watch';
import AgencyConsultantRolesProjection from './AgencyConsultantRolesProjection/watch';
const watcherListing = [
  AgencyClientConsultantProjection,
  AgencyClientsProjection,
  AgencyClientEventLogProjection,
  AgencyConsultantRolesProjection
];

export default watcherListing;
