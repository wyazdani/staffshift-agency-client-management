See below table for all available events in this system.

Columns explained:
Event Code: Enum name for internal use
Event Type: The event name that gets stored in the database
Description: A short description of the event

<!--DATA_START-->
<table><tr><td> Event Code </td><td> Event Type </td><td> Event Data </td><td> Event Aggregate </td><td> Description </td></tr> 
<tr><td> AGENCY_CONSULTANT_ROLE_ADDED </td><td> AgencyConsultantRoleAdded </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "max_consultants": {
      "type": "number"
    }
  },
  "required": [
    "_id",
    "name",
    "description",
    "max_consultants"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  },
  "properties": {
    "agency_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id"
  ]
}
```

 </td><td> The Agency Consultant Role has been created </td></tr>
<tr><td> AGENCY_CONSULTANT_ROLE_ENABLED </td><td> AgencyConsultantRoleEnabled </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  },
  "properties": {
    "agency_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id"
  ]
}
```

 </td><td> The Agency Consultant Role has been enabled </td></tr>
<tr><td> AGENCY_CONSULTANT_ROLE_DISABLED </td><td> AgencyConsultantRoleDisabled </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  },
  "properties": {
    "agency_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id"
  ]
}
```

 </td><td> The Agency Consultant Role has been disabled </td></tr>
<tr><td> AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED </td><td> AgencyConsultantRoleDetailsUpdated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "max_consultants": {
      "type": "number"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "additionalProperties": {
    "type": "string"
  },
  "properties": {
    "agency_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id"
  ]
}
```

 </td><td> The Agency Consultant Role has been updated </td></tr>
<tr><td> AGENCY_CLIENT_CONSULTANT_ASSIGNED </td><td> AgencyClientConsultantAssigned </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "consultant_role_id": {
      "type": "string"
    },
    "consultant_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "consultant_role_id",
    "consultant_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> The Agency Client Consultant has been assigned </td></tr>
<tr><td> AGENCY_CLIENT_CONSULTANT_UNASSIGNED </td><td> AgencyClientConsultantUnassigned </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> The Agency Client Consultant has been unassigned </td></tr>
<tr><td> AGENCY_CLIENT_LINKED </td><td> AgencyClientLinked </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_type": {
      "type": "string"
    },
    "organisation_id": {
      "type": "string"
    },
    "site_id": {
      "type": "string"
    }
  },
  "required": [
    "client_type"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> The Agency Client was linked </td></tr>
<tr><td> AGENCY_CLIENT_UNLINKED </td><td> AgencyClientUnLinked </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_type": {
      "type": "string"
    },
    "organisation_id": {
      "type": "string"
    },
    "site_id": {
      "type": "string"
    }
  },
  "required": [
    "client_type"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> The Agency Client was unlinked, does not indicate a deletion </td></tr>
<tr><td> AGENCY_CLIENT_SYNCED </td><td> AgencyClientSynced </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_type": {
      "type": "string"
    },
    "linked": {
      "type": "boolean"
    },
    "linked_at": {
      "type": "string",
      "format": "date-time"
    },
    "organisation_id": {
      "type": "string"
    },
    "site_id": {
      "type": "string"
    }
  },
  "required": [
    "client_type",
    "linked",
    "linked_at"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Sync event to move data from legacy application to microservice </td></tr>
<tr><td> CONSULTANT_JOB_ASSIGN_INITIATED </td><td> ConsultantJobAssignInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "consultant_id": {
      "type": "string"
    },
    "consultant_role_id": {
      "type": "string"
    },
    "client_ids": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "_id",
    "consultant_id",
    "consultant_role_id",
    "client_ids"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job"
    }
  },
  "required": [
    "agency_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Initiate a job to assign a consultant to multiple clients for an agency </td></tr>
<tr><td> CONSULTANT_JOB_ASSIGN_COMPLETED </td><td> ConsultantJobAssignCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job"
    }
  },
  "required": [
    "agency_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Job assigning a consultant to multiple clients for an agency has completed </td></tr>
<tr><td> CONSULTANT_JOB_PROCESS_STARTED </td><td> ConsultantJobProcessStarted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "estimated_count": {
      "type": "number"
    }
  },
  "required": [
    "estimated_count"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for consultant job is started </td></tr>
<tr><td> CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED </td><td> ConsultantJobProcessItemSucceeded </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_id": {
      "type": "string"
    },
    "consultant_role_id": {
      "type": "string"
    }
  },
  "required": [
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for consultant job is succeeded for one client </td></tr>
<tr><td> CONSULTANT_JOB_PROCESS_ITEM_FAILED </td><td> ConsultantJobProcessItemFailed </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_id": {
      "type": "string"
    },
    "consultant_role_id": {
      "type": "string"
    },
    "errors": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/EventStoreEncodedErrorInterface"
      }
    }
  },
  "required": [
    "client_id",
    "errors"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for consultant job is failed for one client </td></tr>
<tr><td> CONSULTANT_JOB_PROCESS_COMPLETED </td><td> ConsultantJobProcessCompleted </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for consultant job is completed </td></tr>
<tr><td> CONSULTANT_JOB_UNASSIGN_INITIATED </td><td> ConsultantJobUnassignInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "consultant_id": {
      "type": "string"
    },
    "consultant_role_id": {
      "type": "string"
    },
    "client_ids": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "_id",
    "consultant_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job"
    }
  },
  "required": [
    "agency_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Initiate a job to unassign a consultant from multiple clients for an agency </td></tr>
<tr><td> CONSULTANT_JOB_UNASSIGN_COMPLETED </td><td> ConsultantJobUnassignCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job"
    }
  },
  "required": [
    "agency_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Job unassigning a consultant from multiple clients for an agency has completed </td></tr>
<tr><td> CONSULTANT_JOB_TRANSFER_INITIATED </td><td> ConsultantJobTransferInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "from_consultant_id": {
      "type": "string"
    },
    "to_consultant_id": {
      "type": "string"
    },
    "consultant_role_id": {
      "type": "string"
    },
    "client_ids": {
      "type": "array",
      "items": {
        "type": "string"
      }
    }
  },
  "required": [
    "_id",
    "from_consultant_id",
    "to_consultant_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job"
    }
  },
  "required": [
    "agency_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Initiate a job to transfer clients from a consultant to another consultant for an agency </td></tr>
<tr><td> CONSULTANT_JOB_TRANSFER_COMPLETED </td><td> ConsultantJobTransferCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "consultant_job"
    }
  },
  "required": [
    "agency_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> transfer clients of a consultant to another consultant for an agency has completed </td></tr>
<tr><td> AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED </td><td> AgencyClientCreditPaymentTermApplied </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "payment_term"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> credit payment term is applied to agency client </td></tr>
<tr><td> AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED </td><td> AgencyClientCreditPaymentTermInherited </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "payment_term"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> credit payment term for agency client is inherited from the parent </td></tr>
<tr><td> AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED </td><td> AgencyClientPayInAdvancePaymentTermApplied </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "payment_term"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> pay-in-advance payment term is applied to agency client </td></tr>
<tr><td> AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED </td><td> AgencyClientPayInAdvancePaymentTermInherited </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "payment_term"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> pay-in-advance payment term for agency client is inherited from the parent </td></tr>
<tr><td> AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED </td><td> AgencyClientEmptyPaymentTermInherited </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "payment_term"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> empty payment term for agency client is inherited from the parent since no payment term was set on the parent </td></tr>
<tr><td> AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED </td><td> AgencyClientInheritanceProcessStarted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "estimated_count": {
      "type": "number"
    }
  },
  "required": [
    "estimated_count"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "client_inheritance_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for agency client inheritance is started </td></tr>
<tr><td> AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED </td><td> AgencyClientInheritanceProcessItemSucceeded </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "client_inheritance_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for agency client inheritance is succeeded for one client </td></tr>
<tr><td> AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED </td><td> AgencyClientInheritanceProcessItemFailed </td><td> 

```json
{
  "type": "object",
  "properties": {
    "client_id": {
      "type": "string"
    },
    "errors": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/EventStoreEncodedErrorInterface"
      }
    }
  },
  "required": [
    "client_id",
    "errors"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "client_inheritance_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for agency client inheritance is failed for one client </td></tr>
<tr><td> AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED </td><td> AgencyClientInheritanceProcessCompleted </td><td> 

```json
{
  "type": "object",
  "additionalProperties": false,
  "properties": {}
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "client_inheritance_process"
    },
    "job_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "job_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Background process for agency client inheritance is completed </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED </td><td> AgencyClientApplyPaymentTermInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "term": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "term",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying payment term is initiated for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED </td><td> AgencyClientApplyPaymentTermInheritanceInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying payment term inheritance is initiated for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED </td><td> AgencyClientApplyPaymentTermCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying payment term is completed for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED </td><td> AgencyClientApplyPaymentTermInheritanceCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying payment term completed inheritance for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED </td><td> AgencyClientApplyFinancialHoldInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "note": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "note",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying financial hold is initiated for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED </td><td> AgencyClientClearFinancialHoldInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "note": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "note",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Clear financial hold is initiated for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED </td><td> AgencyClientApplyFinancialHoldInheritanceInitiated </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "note": {
      "type": "string"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "note",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying financial hold inheritance is initiated for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED </td><td> AgencyClientApplyFinancialHoldCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying financial hold is completed for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED </td><td> AgencyClientClearFinancialHoldCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Clear financial hold is completed for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED </td><td> AgencyClientApplyFinancialHoldInheritanceCompleted </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    }
  },
  "required": [
    "_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "organisation_job"
    },
    "organisation_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "name",
    "organisation_id"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> Applying financial hold inheritance is completed for the agency client </td></tr>
<tr><td> AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED </td><td> AgencyClientFinancialHoldApplied </td><td> 

```json
{
  "type": "object",
  "properties": {
    "note": {
      "type": "string"
    }
  },
  "required": [
    "note"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "financial_hold"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> financial hold is applied to agency client </td></tr>
<tr><td> AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED </td><td> AgencyClientFinancialHoldInherited </td><td> 

```json
{
  "type": "object",
  "properties": {
    "note": {
      "type": "string"
    }
  },
  "required": [
    "note"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "financial_hold"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> financial hold for agency client is inherited from the parent </td></tr>
<tr><td> AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED </td><td> AgencyClientFinancialHoldCleared </td><td> 

```json
{
  "type": "object",
  "properties": {
    "note": {
      "type": "string"
    }
  },
  "required": [
    "note"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "financial_hold"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> financial hold for agency client is cleared </td></tr>
<tr><td> AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED </td><td> AgencyClientClearFinancialHoldInherited </td><td> 

```json
{
  "type": "object",
  "properties": {
    "note": {
      "type": "string"
    }
  },
  "required": [
    "note"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "financial_hold"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> clear financial hold for agency client is inherited from the parent </td></tr>
<tr><td> AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED </td><td> AgencyClientEmptyFinancialHoldInherited </td><td> 

```json
{
  "type": "object",
  "properties": {
    "note": {
      "type": "string"
    }
  },
  "required": [
    "note"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "financial_hold"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> empty financial hold for agency client is inherited from the parent since no financial hold was set on the parent </td></tr>
<tr><td> AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET </td><td> AgencyClientRequiresPONumberSet </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "requires_po_number": {
      "type": "boolean"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "requires_po_number",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "booking_preference"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> set requires po number for agency client </td></tr>
<tr><td> AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET </td><td> AgencyClientRequiresPONumberUnset </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "requires_po_number": {
      "type": "boolean"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "requires_po_number",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "booking_preference"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> unset requires po number for agency client </td></tr>
<tr><td> AGENCY_CLIENT_REQUIRES_SHIFT_REF_NUMBER_SET </td><td> AgencyClientRequiresShiftRefNumberSet </td><td> 

```json
{
  "type": "object",
  "properties": {
    "_id": {
      "type": "string"
    },
    "requires_shift_ref_number": {
      "type": "boolean"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "_id",
    "requires_shift_ref_number",
    "client_id"
  ],
  "additionalProperties": false
}
```

 </td><td> 

```json
{
  "type": "object",
  "properties": {
    "agency_id": {
      "type": "string"
    },
    "name": {
      "type": "string",
      "const": "booking_preference"
    },
    "client_id": {
      "type": "string"
    }
  },
  "required": [
    "agency_id",
    "client_id",
    "name"
  ],
  "additionalProperties": {
    "type": "string"
  }
}
```

 </td><td> unset requires po number for agency client </td></tr>
</table><!--DATA_END-->