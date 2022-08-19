import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError} from 'a24-node-error-utils';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventStoreErrorEncoder} from '../../EventStoreErrorEncoder';
import {RetryService, RetryableError, NonRetryableError} from '../../RetryService';
import {CommandBusHelper} from './CommandBusHelper';

export class RetryableSetFinancialHold {
  constructor(
    private maxRetry: number,
    private retryDelay: number,
    private logger: LoggerContext,
    private commandBusHelper: CommandBusHelper
  ) {}

  /**
   * sets financial hold on a client by applying retry policy
   */
  async setFinancialHold(clientId: string, financial_hold: boolean, note: string): Promise<boolean> {
    const retryService = new RetryService(this.maxRetry, this.retryDelay);

    try {
      await retryService.exec(() => this.runSetFinancialHoldCommand(clientId, financial_hold, note));
    } catch (error) {
      await this.commandBusHelper.failItem(clientId, EventStoreErrorEncoder.encodeArray(retryService.getErrors()));
      return false;
    }
    await this.commandBusHelper.succeedItem(clientId);
    return true;
  }

  private async runSetFinancialHoldCommand(clientId: string, financialHold: boolean, note: string): Promise<void> {
    try {
      this.logger.debug('Setting financial hold on a client', {
        clientId,
        financialHold
      });
      await this.commandBusHelper.setFinancialHold(clientId, financialHold, note);
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          clientId,
          financialHold,
          error
        });
        throw new RetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during setting financial hold', error);
        throw new RetryableError(error);
      }
      // We don't have any validation error currently on this command.
    }
  }

  /**
   * set inherited financial hold on a client using retry policy
   */
  async setInheritedFinancialHold(
    clientId: string,
    financialHold: boolean,
    note: string,
    force: boolean
  ): Promise<boolean> {
    const retryService = new RetryService(this.maxRetry, this.retryDelay);

    try {
      await retryService.exec(() => this.runSetInheritedFinancialHoldCommand(clientId, financialHold, note, force));
    } catch (error) {
      await this.commandBusHelper.failItem(clientId, EventStoreErrorEncoder.encodeArray(retryService.getErrors()));
      return false;
    }
    await this.commandBusHelper.succeedItem(clientId);
    return true;
  }

  private async runSetInheritedFinancialHoldCommand(
    clientId: string,
    financialHold: boolean,
    note: string,
    force: boolean
  ): Promise<void> {
    try {
      this.logger.debug('Setting financial hold on a client', {
        clientId,
        financialHold
      });
      await this.commandBusHelper.setInheritedFinancialHold(clientId, financialHold, note, force);
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          clientId,
          financialHold,
          error
        });
        throw new RetryableError(error);
      } else if (error instanceof ValidationError) {
        this.logger.debug('Setting inherited financial hold was not possible due to business validation', error);
        throw new NonRetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during setting inherited financial hold', error);
        throw new RetryableError(error);
      }
    }
  }
}
