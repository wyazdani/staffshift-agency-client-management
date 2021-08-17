# Staffshift Agency Client Management

## Aggregate Roots
These are the current aggregate roots we have defined. For more detailed information on aggregate roots see [here]()

### Agency
* Consists of Agency Consultants Role Configuration
  * Not related to a specific `Agency Client`
  * A foreign key is used from the `Agency Client` aggregate
  * Cascading delete not applicable when deleting `Agency Client`

### Agency Client
* Consists of Agency Client Consultants
  * Cascading delete applicable when deleting `Agency Client`

## Events
Will be generated from [here](../src/Events.js)

## Commands
TBA

## Saga
TBA

## Considerations for:

### Agency Consultants Role Configuration
Add discussion points here.