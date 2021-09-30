import {Readable, Writable, Stream} from 'stream';
import {ChangeStream} from 'mongodb';
import {LoggerContext} from 'a24-logzio-winston';
/**
 * Responsible for attaching event listeners/handlers to the stream both writable and readable
 */
export class StreamEventHandlers {
  /**
   * Basic event handlers to reduce boiler plate code
   *
   * @param {Object} logger - The logger object
   * @param {Stream} stream - The stream to attach event handlers to
   *
   * @returns {Stream} - THe passed in stream
   */
  static attachEventHandlers(logger: LoggerContext, stream: Stream | ChangeStream): Stream | ChangeStream {
    if (stream instanceof Readable) {
      stream.on('end', () => {
        logger.info(`Stream event: End for ${stream.constructor.name}`);
      });
    }
    if (stream instanceof Writable) {
      stream.on('finish', () => {
        logger.info(`Stream event: Finish for ${stream.constructor.name}`);
      });
    }
    // Both Readable and Writeable support these events
    stream.on('close', () => {
      logger.info(`Stream event: Close for ${stream.constructor.name}`);
    });
    stream.on('error', (error: Error) => {
      logger.error(`Stream event error received for ${stream.constructor.name}, exiting process now`, error);
      process.exit(1);
    });

    return stream;
  }
}
