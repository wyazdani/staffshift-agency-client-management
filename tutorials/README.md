# Staffshift Agency Client Management


## Bounded Contexts

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


### Legacy Collection - AgencyOrganisationLink
```json
{
  "_id": {
    "$oid": "51c965fdcebdc38770000002"
  },
  "bAgcyLnkd": true,
  "bReqPo": false,
  "bReqShftRefNum": false,
  "dtCreate": {
    "$date": {
      "$numberLong": "1372153341000"
    }
  },
  "dtMod": {
    "$date": {
      "$numberLong": "1594997765000"
    }
  },
  "sAgcyId": "511c7196cfbdc3817e000000",
  "sAgcyNme": {
    "low": "nursing services of sa",
    "real": "Nursing Services of SA"
  },
  "sAgcyOrgRef": {
    "low": "hland1gn",
    "real": "HLAND1GN"
  },
  "sAgcyOrgType": {
    "low": "ward",
    "real": "ward"
  },
  "sOrgId": "5127756ecebdc32d65000000",
  "sOrgNme": {
    "low": "highlands house",
    "real": "Highlands House"
  },
  "sSteAdd": {
    "low": "234 upper buitenkant street",
    "real": "234 Upper Buitenkant Street"
  },
  "sSteId": "51c46362cebdc3ef35000000",
  "sSteNme": {
    "low": "highlands house",
    "real": "Highlands House"
  },
  "sStePCd": {
    "low": "8001",
    "real": "8001"
  },
  "sStePrv": {
    "low": "western cape",
    "real": "Western Cape"
  },
  "sSteTyp": {
    "low": "care home",
    "real": "Care Home"
  },
  "sSteTypId": "5121f6940615b723af5df981",
  "sWrdId": "51c965fdcebdc38770000000",
  "sWrdNme": {
    "low": "general",
    "real": "General"
  },
  "sWrdTyp": {
    "low": "general",
    "real": "General"
  },
  "sWrdTypId": "50be4e32cf3b057b75c120e3",
  "objSteGeoLctn": {
    "coordinates": [
      {
        "$numberDouble": "18.41906"
      },
      {
        "$numberDouble": "-33.94101"
      }
    ],
    "type": "Point"
  }
}
```

#### All Fields
| Field Name | Duplicated Data |
| --- | --- |
| bAgcyLnkd | false |
| bReqPo | false |
| bReqShftRefNum | false |
| dtCreate | false |
| dtMod | false |
| sAgcyId | reference |
| sAgcyNme | true |
| sAgcyOrgRef | false |
| sAgcyOrgType | `organisation|site|ward` |
| sOrgId | reference |
| sOrgNme | true |
| sSteAdd | true |
| sSteId | reference |
| sSteNme | true |
| sStePCd | true |
| sStePrv | true |
| sSteTyp | true |
| sSteTypId | reference |
| sWrdId | reference |
| sWrdNme | true |
| sWrdTyp | true |
| sWrdTypId | reference |
| objSteGeoLctn | true |

#### References
| Field Name | Details |
| --- | --- |
| sAgcyId | reference |
| sOrgId | reference |
| sSteId | reference |
| sSteTypId | reference |
| sWrdTypId | reference |

#### AgencyClient Link Data
| Field Name | Details |
| --- | --- |
| sAgcyOrgRef | false |
| sAgcyOrgType | `organisation|site|ward` |
| bReqPo | false |
| bReqShftRefNum | false |
| bAgcyLnkd | false |
| dtCreate | false |
| dtMod | false |