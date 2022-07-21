import {LoggerContext} from 'a24-logzio-winston';
import {ValidationError} from 'a24-node-error-utils';
import {SequenceIdMismatch} from '../../../errors/SequenceIdMismatch';
import {EventStoreErrorEncoder} from '../../EventStoreErrorEncoder';
import {RetryService, RetryableError, NonRetryableError} from '../../RetryService';
import {CommandBusHelper} from './CommandBusHelper';

export class RetryableApplyPaymentTerm {
  constructor(
    private maxRetry: number,
    private retryDelay: number,
    private logger: LoggerContext,
    private commandBusHelper: CommandBusHelper
  ) {}

  /**
   * apply payment term on a client by applying retry policy
   */
  async applyPaymentTerm(clientId: string, term: string): Promise<boolean> {
    const retryService = new RetryService(this.maxRetry, this.retryDelay);

    try {
      await retryService.exec(() => this.runApplyPaymentTermCommand(clientId, term));
    } catch (error) {
      await this.commandBusHelper.failItem(clientId, EventStoreErrorEncoder.encodeArray(retryService.getErrors()));
      return false;
    }
    await this.commandBusHelper.succeedItem(clientId);
    return true;
  }

  private async runApplyPaymentTermCommand(clientId: string, term: string): Promise<void> {
    try {
      this.logger.debug('Applying payment term on a client', {
        clientId,
        term
      });
      await this.commandBusHelper.applyPaymentTerm(clientId, term);
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          clientId,
          term,
          error
        });
        throw new RetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during applying payment term', error);
        throw new RetryableError(error);
      }
      // We don't have any validation error currently on this command.
    }
  }

  /**
   * apply inherited payment term on a client using retry policy
   */
  async applyInheritedPaymentTerm(clientId: string, term: string, force: boolean): Promise<boolean> {
    const retryService = new RetryService(this.maxRetry, this.retryDelay);

    try {
      await retryService.exec(() => this.runApplyInheritedPaymentTermCommand(clientId, term, force));
    } catch (error) {
      await this.commandBusHelper.failItem(clientId, EventStoreErrorEncoder.encodeArray(retryService.getErrors()));
      return false;
    }
    await this.commandBusHelper.succeedItem(clientId);
    return true;
  }

  private async runApplyInheritedPaymentTermCommand(clientId: string, term: string, force: boolean): Promise<void> {
    try {
      this.logger.debug('Applying inherited payment term on a client', {
        clientId,
        term
      });
      await this.commandBusHelper.applyInheritedPaymentTerm(clientId, term, force);
    } catch (error) {
      if (error instanceof SequenceIdMismatch) {
        this.logger.notice('Sequence id mismatch happened. we try to retry again', {
          clientId,
          term,
          error
        });
        throw new RetryableError(error);
      } else if (error instanceof ValidationError) {
        this.logger.debug('Applying inherited payment term was not possible due to business validation', error);
        throw new NonRetryableError(error);
      } else {
        this.logger.error('Unknown error occurred during applying inherited payment term', error);
        throw new RetryableError(error);
      }
    }
  }
}
