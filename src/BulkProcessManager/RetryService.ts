import retry from 'async-retry';

export class RetryableError extends Error {
  public code: 'RetryableError';
  public error: Error;
  constructor(err: Error) {
    super('Error');
    this.error = err;
  }
}
export class NonRetryableError extends Error {
  public code: 'NonRetryable';
  public error: Error;
  constructor(err: Error) {
    super('Error');
    this.error = err;
  }
}

/**
 * responsible for retrying operations for certain times
 */
export class RetryService {
  private errors: Error[] = [];
  constructor(private maxRetry: number, private retryDelay: number) {}

  /**
   * runs retry system
   *
   * @param func: the function that will be called in each retry
   * if function throws Retryable error we will try to retry, otherwise we will cancel the retry
   */
  async exec(func: () => Promise<void>): Promise<void> {
    await retry(
      async (bail) => {
        try {
          await func();
        } catch (error) {
          if (error instanceof RetryableError || error instanceof NonRetryableError) {
            this.errors.push(error.error);
          } else {
            this.errors.push(error);
          }
          if (error instanceof RetryableError) {
            throw error;
          } else {
            bail(error); // bail causes not to do any retry
          }
        }
      },
      {
        retries: this.maxRetry,
        factor: 1,
        minTimeout: this.retryDelay
      }
    );
  }

  getErrors(): Error[] {
    return this.errors;
  }
}
