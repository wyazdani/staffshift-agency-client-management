# Agency
This aggregate represents the agency aspect within the agency client management service

## Using an example to explain:
* Agency clients can have consultants assigned
* Agency client consultants are assigned by role
* Each Agency is able to define their own roles
* These roles are configured on agency level

## Chosen Aggregate:
### Agency
* Aggregate Id
```json
{
  "agency_id": "<agency_id>"
}
```

## Alternative Aggregate Considerations:

### Agency Consultants
* Aggregate Id
```json
{
  "agency_id": "<agency_id>",
  "section": "consultant_roles"
}
```

### Agency Settings
* Aggregate Id
```json
{
  "agency_id": "<agency_id>",
  "section": "settings"
}
```

### Reasoning:
It felt strange to create a "virtual" section property to further granularise the aggregate. Since this is the first attempt at this we chose to rather have fewer aggregates even though best practice is to have more granular aggregates, problem is when do you stop. We would need to be aware of all invariance checks required, which we are currently figuring out. The number of events per aggregate will also be very low based on the current service and nature of the data and as such do not foresee a negative effect with this approach.

