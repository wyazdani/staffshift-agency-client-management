import {AbstractError} from 'a24-node-error-utils';
import {SchemaErrorDetail} from 'z-schema';
import {CommandValidationFormatter} from './CommandValidationFormatter';

/**
 * We decided to go with status 500 since if it happens it means a misconfiguration/bad code in our implementation
 */
export class CommandValidationError extends AbstractError {
  status = 500;
  code = 'COMMAND_VALIDATION_ERROR';
  formatter = new CommandValidationFormatter();
  schemaErrors: SchemaErrorDetail[];

  setSchemaErrors(errors: SchemaErrorDetail[]): CommandValidationError {
    this.schemaErrors = errors;
    return this;
  }
}
