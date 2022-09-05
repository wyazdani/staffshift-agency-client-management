export enum EventsEnum {
  AGENCY_CONSULTANT_ROLE_ADDED = 'AgencyConsultantRoleAdded',
  AGENCY_CONSULTANT_ROLE_ENABLED = 'AgencyConsultantRoleEnabled',
  AGENCY_CONSULTANT_ROLE_DISABLED = 'AgencyConsultantRoleDisabled',
  AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED = 'AgencyConsultantRoleDetailsUpdated',
  AGENCY_CLIENT_CONSULTANT_ASSIGNED = 'AgencyClientConsultantAssigned',
  AGENCY_CLIENT_CONSULTANT_UNASSIGNED = 'AgencyClientConsultantUnassigned',
  AGENCY_CLIENT_LINKED = 'AgencyClientLinked',
  AGENCY_CLIENT_UNLINKED = 'AgencyClientUnLinked',
  AGENCY_CLIENT_SYNCED = 'AgencyClientSynced',
  CONSULTANT_JOB_ASSIGN_INITIATED = 'ConsultantJobAssignInitiated',
  CONSULTANT_JOB_ASSIGN_COMPLETED = 'ConsultantJobAssignCompleted',
  CONSULTANT_JOB_PROCESS_STARTED = 'ConsultantJobProcessStarted',
  CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED = 'ConsultantJobProcessItemSucceeded',
  CONSULTANT_JOB_PROCESS_ITEM_FAILED = 'ConsultantJobProcessItemFailed',
  CONSULTANT_JOB_PROCESS_COMPLETED = 'ConsultantJobProcessCompleted',
  CONSULTANT_JOB_UNASSIGN_INITIATED = 'ConsultantJobUnassignInitiated',
  CONSULTANT_JOB_UNASSIGN_COMPLETED = 'ConsultantJobUnassignCompleted',
  CONSULTANT_JOB_TRANSFER_INITIATED = 'ConsultantJobTransferInitiated',
  CONSULTANT_JOB_TRANSFER_COMPLETED = 'ConsultantJobTransferCompleted',
  AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED = 'AgencyClientCreditPaymentTermApplied',
  AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED = 'AgencyClientCreditPaymentTermInherited',
  AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED = 'AgencyClientPayInAdvancePaymentTermApplied',
  AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED = 'AgencyClientPayInAdvancePaymentTermInherited',
  AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED = 'AgencyClientEmptyPaymentTermInherited',
  AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED = 'AgencyClientInheritanceProcessStarted',
  AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED = 'AgencyClientInheritanceProcessItemSucceeded',
  AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED = 'AgencyClientInheritanceProcessItemFailed',
  AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED = 'AgencyClientInheritanceProcessCompleted',
  AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED = 'AgencyClientApplyPaymentTermInitiated',
  AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED = 'AgencyClientApplyPaymentTermInheritanceInitiated',
  AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED = 'AgencyClientApplyPaymentTermCompleted',
  AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED = 'AgencyClientApplyPaymentTermInheritanceCompleted',
  AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED = 'AgencyClientApplyFinancialHoldInitiated',
  AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED = 'AgencyClientClearFinancialHoldInitiated',
  AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED = 'AgencyClientApplyFinancialHoldInheritanceInitiated',
  AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED = 'AgencyClientApplyFinancialHoldCompleted',
  AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED = 'AgencyClientClearFinancialHoldCompleted',
  AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED = 'AgencyClientApplyFinancialHoldInheritanceCompleted',
  AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED = 'AgencyClientFinancialHoldApplied',
  AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED = 'AgencyClientFinancialHoldInherited',
  AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED = 'AgencyClientFinancialHoldCleared',
  AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED = 'AgencyClientClearFinancialHoldInherited',
  AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED = 'AgencyClientEmptyFinancialHoldInherited',
  AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET = 'AgencyClientRequiresPONumberSet',
  AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET = 'AgencyClientRequiresPONumberUnset',
  AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET = 'AgencyClientRequiresUniquePONumberSet',
  AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET = 'AgencyClientRequiresUniquePONumberUnset'
}

type EventsType = {
  [key in EventsEnum]: {name: string; description: string};
};

export const events: EventsType = {
  [EventsEnum.AGENCY_CONSULTANT_ROLE_ADDED]: {
    name: 'AgencyConsultantRoleAdded',
    description: 'The Agency Consultant Role has been created'
  },
  [EventsEnum.AGENCY_CONSULTANT_ROLE_ENABLED]: {
    name: 'AgencyConsultantRoleEnabled',
    description: 'The Agency Consultant Role has been enabled'
  },
  [EventsEnum.AGENCY_CONSULTANT_ROLE_DISABLED]: {
    name: 'AgencyConsultantRoleDisabled',
    description: 'The Agency Consultant Role has been disabled'
  },
  [EventsEnum.AGENCY_CONSULTANT_ROLE_DETAILS_UPDATED]: {
    name: 'AgencyConsultantRoleDetailsUpdated',
    description: 'The Agency Consultant Role has been updated'
  },
  [EventsEnum.AGENCY_CLIENT_CONSULTANT_ASSIGNED]: {
    name: 'AgencyClientConsultantAssigned',
    description: 'The Agency Client Consultant has been assigned'
  },
  [EventsEnum.AGENCY_CLIENT_CONSULTANT_UNASSIGNED]: {
    name: 'AgencyClientConsultantUnassigned',
    description: 'The Agency Client Consultant has been unassigned'
  },
  [EventsEnum.AGENCY_CLIENT_LINKED]: {
    name: 'AgencyClientLinked',
    description: 'The Agency Client was linked'
  },
  [EventsEnum.AGENCY_CLIENT_UNLINKED]: {
    name: 'AgencyClientUnLinked',
    description: 'The Agency Client was unlinked, does not indicate a deletion'
  },
  [EventsEnum.AGENCY_CLIENT_SYNCED]: {
    name: 'AgencyClientSynced',
    description: 'Sync event to move data from legacy application to microservice'
  },
  [EventsEnum.CONSULTANT_JOB_ASSIGN_INITIATED]: {
    name: 'ConsultantJobAssignInitiated',
    description: 'Initiate a job to assign a consultant to multiple clients for an agency'
  },
  [EventsEnum.CONSULTANT_JOB_ASSIGN_COMPLETED]: {
    name: 'ConsultantJobAssignCompleted',
    description: 'Job assigning a consultant to multiple clients for an agency has completed'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_STARTED]: {
    name: 'ConsultantJobProcessStarted',
    description: 'Background process for consultant job is started'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_SUCCEEDED]: {
    name: 'ConsultantJobProcessItemSucceeded',
    description: 'Background process for consultant job is succeeded for one client'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_ITEM_FAILED]: {
    name: 'ConsultantJobProcessItemFailed',
    description: 'Background process for consultant job is failed for one client'
  },
  [EventsEnum.CONSULTANT_JOB_PROCESS_COMPLETED]: {
    name: 'ConsultantJobProcessCompleted',
    description: 'Background process for consultant job is completed'
  },
  [EventsEnum.CONSULTANT_JOB_UNASSIGN_INITIATED]: {
    name: 'ConsultantJobUnassignInitiated',
    description: 'Initiate a job to unassign a consultant from multiple clients for an agency'
  },
  [EventsEnum.CONSULTANT_JOB_UNASSIGN_COMPLETED]: {
    name: 'ConsultantJobUnassignCompleted',
    description: 'Job unassigning a consultant from multiple clients for an agency has completed'
  },
  [EventsEnum.CONSULTANT_JOB_TRANSFER_INITIATED]: {
    name: 'ConsultantJobTransferInitiated',
    description: 'Initiate a job to transfer clients from a consultant to another consultant for an agency'
  },
  [EventsEnum.CONSULTANT_JOB_TRANSFER_COMPLETED]: {
    name: 'ConsultantJobTransferCompleted',
    description: 'transfer clients of a consultant to another consultant for an agency has completed'
  },
  [EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_APPLIED]: {
    name: 'AgencyClientCreditPaymentTermApplied',
    description: 'credit payment term is applied to agency client'
  },
  [EventsEnum.AGENCY_CLIENT_CREDIT_PAYMENT_TERM_INHERITED]: {
    name: 'AgencyClientCreditPaymentTermInherited',
    description: 'credit payment term for agency client is inherited from the parent'
  },
  [EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_APPLIED]: {
    name: 'AgencyClientPayInAdvancePaymentTermApplied',
    description: 'pay-in-advance payment term is applied to agency client'
  },
  [EventsEnum.AGENCY_CLIENT_PAY_IN_ADVANCE_PAYMENT_TERM_INHERITED]: {
    name: 'AgencyClientPayInAdvancePaymentTermInherited',
    description: 'pay-in-advance payment term for agency client is inherited from the parent'
  },
  [EventsEnum.AGENCY_CLIENT_EMPTY_PAYMENT_TERM_INHERITED]: {
    name: 'AgencyClientEmptyPaymentTermInherited',
    description:
      'empty payment term for agency client is inherited from the parent since no payment term was set on the parent'
  },
  [EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_STARTED]: {
    name: 'AgencyClientInheritanceProcessStarted',
    description: 'Background process for agency client inheritance is started'
  },
  [EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_SUCCEEDED]: {
    name: 'AgencyClientInheritanceProcessItemSucceeded',
    description: 'Background process for agency client inheritance is succeeded for one client'
  },
  [EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_ITEM_FAILED]: {
    name: 'AgencyClientInheritanceProcessItemFailed',
    description: 'Background process for agency client inheritance is failed for one client'
  },
  [EventsEnum.AGENCY_CLIENT_INHERITANCE_PROCESS_COMPLETED]: {
    name: 'AgencyClientInheritanceProcessCompleted',
    description: 'Background process for agency client inheritance is completed'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INITIATED]: {
    name: 'AgencyClientApplyPaymentTermInitiated',
    description: 'Applying payment term is initiated for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_INITIATED]: {
    name: 'AgencyClientApplyPaymentTermInheritanceInitiated',
    description: 'Applying payment term inheritance is initiated for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_COMPLETED]: {
    name: 'AgencyClientApplyPaymentTermCompleted',
    description: 'Applying payment term is completed for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_PAYMENT_TERM_INHERITANCE_COMPLETED]: {
    name: 'AgencyClientApplyPaymentTermInheritanceCompleted',
    description: 'Applying payment term completed inheritance for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INITIATED]: {
    name: 'AgencyClientApplyFinancialHoldInitiated',
    description: 'Applying financial hold is initiated for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INITIATED]: {
    name: 'AgencyClientClearFinancialHoldInitiated',
    description: 'Clear financial hold is initiated for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_INITIATED]: {
    name: 'AgencyClientApplyFinancialHoldInheritanceInitiated',
    description: 'Applying financial hold inheritance is initiated for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_COMPLETED]: {
    name: 'AgencyClientApplyFinancialHoldCompleted',
    description: 'Applying financial hold is completed for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_COMPLETED]: {
    name: 'AgencyClientClearFinancialHoldCompleted',
    description: 'Clear financial hold is completed for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_APPLY_FINANCIAL_HOLD_INHERITANCE_COMPLETED]: {
    name: 'AgencyClientApplyFinancialHoldInheritanceCompleted',
    description: 'Applying financial hold inheritance is completed for the agency client'
  },
  [EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_APPLIED]: {
    name: 'AgencyClientFinancialHoldApplied',
    description: 'financial hold is applied to agency client'
  },
  [EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_INHERITED]: {
    name: 'AgencyClientFinancialHoldCleared',
    description: 'financial hold for agency client is inherited from the parent'
  },
  [EventsEnum.AGENCY_CLIENT_FINANCIAL_HOLD_CLEARED]: {
    name: 'AgencyClientFinancialHoldCleared',
    description: 'financial hold for agency client is cleared'
  },
  [EventsEnum.AGENCY_CLIENT_CLEAR_FINANCIAL_HOLD_INHERITED]: {
    name: 'AgencyClientClearFinancialHoldInherited',
    description: 'clear financial hold for agency client is inherited from the parent'
  },
  [EventsEnum.AGENCY_CLIENT_EMPTY_FINANCIAL_HOLD_INHERITED]: {
    name: 'AgencyClientEmptyFinancialHoldInherited',
    description:
      'empty financial hold for agency client is inherited from the parent since no financial hold was set on the parent'
  },
  [EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_SET]: {
    name: 'AgencyClientRequiresPONumberSet',
    description: 'Requires po number was set for agency client'
  },
  [EventsEnum.AGENCY_CLIENT_REQUIRES_PO_NUMBER_UNSET]: {
    name: 'AgencyClientRequiresPONumberUnset',
    description: 'Requires po number was unset for agency client'
  },
  [EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_SET]: {
    name: 'AgencyClientRequiresUniquePONumberSet',
    description: 'Requires unique po number was set for agency client'
  },
  [EventsEnum.AGENCY_CLIENT_REQUIRES_UNIQUE_PO_NUMBER_UNSET]: {
    name: 'AgencyClientRequiresUniquePONumberUnset',
    description: 'Requires unique po number was unset for agency client'
  }
};
