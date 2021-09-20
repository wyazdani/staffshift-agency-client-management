# Agency Client
This aggregate represents the agency client, and may well be way too generic.

## Chosen Aggregate:
### Agency Client
* Aggregate Id
```json
{
  "agency_id": "<agency_id>",
  "client_id": "<client_id>"
}
```

## Alternative Aggregate Considerations:
### Agency Client Consultants
* Aggregate Id
```json
{
  "agency_id": "<agency_id>",
  "client_id": "<client_id>",
  "section": "consultants"
}
```

### Reasoning:
It again felt strange to create a "virtual" section property to further granularise the aggregate. The number of events per aggregate will also be reasonably low based on the current service and nature of the data and as such do not foresee a negative effect with this approach. We could also implement snaphots if we do notice that there is a major performance issue on the write model.