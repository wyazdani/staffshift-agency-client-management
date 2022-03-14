See below table for all available events in this system.

Columns explained:
Event Code: Enum name for internal use
Event Type: The event name that gets stored in the database
Description: A short description of the event

<!--DATA_START-->
| Event Code | Event Type | Description |
| --- | --- | --- |
| AGENCY_CONSULTANT_ROLE_ADDED | AgencyConsultantRoleAdded | The Agency Consultant Role has been created |
| AGENCY_CONSULTANT_ROLE_ENABLED | AgencyConsultantRoleEnabled | The Agency Consultant Role has been enabled |
| AGENCY_CONSULTANT_ROLE_DISABLED | AgencyConsultantRoleDisabled | The Agency Consultant Role has been disabled |
| AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED | AgencyConsultantRoleDetailsUpdated | The Agency Consultant Role has been updated |
| AGENCY_CLIENT_CONSULTANT_ASSIGNED | AgencyClientConsultantAssigned | The Agency Client Consultant has been assigned |
| AGENCY_CLIENT_CONSULTANT_UNASSIGNED | AgencyClientConsultantUnassigned | The Agency Client Consultant has been unassigned |
| AGENCY_CLIENT_LINKED | AgencyClientLinked | The Agency Client was linked |
| AGENCY_CLIENT_UNLINKED | AgencyClientUnLinked | The Agency Client was unlinked, does not indicate a deletion |
| AGENCY_CLIENT_SYNCED | AgencyClientSynced | Sync event to move data from legacy application to microservice |
| CONSULTANT_JOB_ASSIGN_INITIATED | ConsultantJobAssignInitiated | Initiate a job to assign a consultant to multiple clients for an agency |
| CONSULTANT_JOB_ASSIGN_COMPLETED | ConsultantJobAssignCompleted | Job assigning a consultant to multiple clients for an agency has completed |
| CONSULTANT_JOB_ASSIGN_PROCESS_STARTED | ConsultantJobAssignProcessStarted | Background process assigning a consultant to multiple clients for an agency is started |
| CONSULTANT_JOB_ASSIGN_PROCESS_PROGRESSED | ConsultantJobAssignProcessProgressed | Background process assigning a consultant to multiple clients for an agency is progressed |
| CONSULTANT_JOB_ASSIGN_PROCESS_ITEM_FAILED | ConsultantJobAssignProcessItemFailed | Background process assigning a consultant to multiple clients for an agency is failed for one client |
| CONSULTANT_JOB_ASSIGN_PROCESS_COMPLETED | ConsultantJobAssignProcessCompleted | Background process assigning a consultant to multiple clients for an agency is completed |
<!--DATA_END-->