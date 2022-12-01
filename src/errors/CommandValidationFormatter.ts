import {DefaultErrorFormatter} from 'a24-node-error-utils';
import {CommandValidationError} from './CommandValidationError';

/**
 * Formatter that is responsible to format CommandValidationError
 * We only add schema errors to the logs since we want it to be logged
 * But in API level we don't need that information since we will expose unnecessary information.
 */
export class CommandValidationFormatter extends DefaultErrorFormatter<CommandValidationError> {
  formatLog(error: CommandValidationError): {[key in string]: unknown} {
    const logOutput = super.formatLog(error);

    logOutput.schema_errors = error.schemaErrors;
    return logOutput;
  }
}
