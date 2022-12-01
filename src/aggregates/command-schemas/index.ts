// DO NOT TOUCH THIS FILE MANUALLY, USE 'npm run dev-generate-command-schemas'
import add_agency_client_consultant from './add_agency_client_consultant.json';
import add_agency_consultant_role from './add_agency_consultant_role.json';
import apply_inherited_payment_term from './apply_inherited_payment_term.json';
import apply_payment_term from './apply_payment_term.json';
import assign_consultant from './assign_consultant.json';
import complete_apply_financial_hold from './complete_apply_financial_hold.json';
import complete_apply_payment_term from './complete_apply_payment_term.json';
import complete_assign_consultant from './complete_assign_consultant.json';
import complete_clear_financial_hold from './complete_clear_financial_hold.json';
import complete_client_inheritance_process from './complete_client_inheritance_process.json';
import complete_consultant_job_process from './complete_consultant_job_process.json';
import complete_inherit_financial_hold from './complete_inherit_financial_hold.json';
import complete_inherit_payment_term from './complete_inherit_payment_term.json';
import complete_transfer_consultant from './complete_transfer_consultant.json';
import complete_unassign_consultant from './complete_unassign_consultant.json';
import disable_agency_consultant_role from './disable_agency_consultant_role.json';
import enable_agency_consultant_role from './enable_agency_consultant_role.json';
import fail_item_client_inheritance_process from './fail_item_client_inheritance_process.json';
import fail_item_consultant_job_process from './fail_item_consultant_job_process.json';
import inherit_financial_hold_client_link from './inherit_financial_hold_client_link.json';
import inherit_payment_term_client_link from './inherit_payment_term_client_link.json';
import initiate_apply_financial_hold from './initiate_apply_financial_hold.json';
import initiate_apply_payment_term from './initiate_apply_payment_term.json';
import initiate_clear_financial_hold from './initiate_clear_financial_hold.json';
import initiate_inherit_financial_hold from './initiate_inherit_financial_hold.json';
import initiate_inherit_payment_term from './initiate_inherit_payment_term.json';
import link_agency_client from './link_agency_client.json';
import remove_agency_client_consultant from './remove_agency_client_consultant.json';
import set_financial_hold from './set_financial_hold.json';
import set_inherited_financial_hold from './set_inherited_financial_hold.json';
import set_requires_booking_password from './set_requires_booking_password.json';
import set_requires_po_number from './set_requires_po_number.json';
import set_requires_shift_ref_number from './set_requires_shift_ref_number.json';
import set_requires_unique_po_number from './set_requires_unique_po_number.json';
import start_client_inheritance_process from './start_client_inheritance_process.json';
import start_consultant_job_process from './start_consultant_job_process.json';
import succeed_item_client_inheritance_process from './succeed_item_client_inheritance_process.json';
import succeed_item_consultant_job_process from './succeed_item_consultant_job_process.json';
import sync_agency_client from './sync_agency_client.json';
import transfer_agency_client_consultant from './transfer_agency_client_consultant.json';
import transfer_consultant from './transfer_consultant.json';
import unassign_consultant from './unassign_consultant.json';
import unlink_agency_client from './unlink_agency_client.json';
import unset_requires_booking_password from './unset_requires_booking_password.json';
import unset_requires_po_number from './unset_requires_po_number.json';
import unset_requires_shift_ref_number from './unset_requires_shift_ref_number.json';
import unset_requires_unique_po_number from './unset_requires_unique_po_number.json';
import update_agency_consultant_role from './update_agency_consultant_role.json';
import update_booking_passwords from './update_booking_passwords.json';

const commandSchemas: {[key in string]: unknown} = {
  add_agency_client_consultant,
  add_agency_consultant_role,
  apply_inherited_payment_term,
  apply_payment_term,
  assign_consultant,
  complete_apply_financial_hold,
  complete_apply_payment_term,
  complete_assign_consultant,
  complete_clear_financial_hold,
  complete_client_inheritance_process,
  complete_consultant_job_process,
  complete_inherit_financial_hold,
  complete_inherit_payment_term,
  complete_transfer_consultant,
  complete_unassign_consultant,
  disable_agency_consultant_role,
  enable_agency_consultant_role,
  fail_item_client_inheritance_process,
  fail_item_consultant_job_process,
  inherit_financial_hold_client_link,
  inherit_payment_term_client_link,
  initiate_apply_financial_hold,
  initiate_apply_payment_term,
  initiate_clear_financial_hold,
  initiate_inherit_financial_hold,
  initiate_inherit_payment_term,
  link_agency_client,
  remove_agency_client_consultant,
  set_financial_hold,
  set_inherited_financial_hold,
  set_requires_booking_password,
  set_requires_po_number,
  set_requires_shift_ref_number,
  set_requires_unique_po_number,
  start_client_inheritance_process,
  start_consultant_job_process,
  succeed_item_client_inheritance_process,
  succeed_item_consultant_job_process,
  sync_agency_client,
  transfer_agency_client_consultant,
  transfer_consultant,
  unassign_consultant,
  unlink_agency_client,
  unset_requires_booking_password,
  unset_requires_po_number,
  unset_requires_shift_ref_number,
  unset_requires_unique_po_number,
  update_agency_consultant_role,
  update_booking_passwords
};

export default commandSchemas;
