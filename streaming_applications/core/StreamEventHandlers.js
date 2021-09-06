'use strict';

const {Readable, Writable} = require('stream');

/**
 * Responsible for attaching event listeners/handlers to the stream both writable and readable
 */
class StreamEventHandlers {

  /**
   * Basic event handlers to reduce boiler plate code
   *
   * @param {Object} logger - The logger object
   * @param {Stream} stream - The stream to attach event handlers to
   *
   * @returns {Stream} - THe passed in stream
   */
  static attachEventHandlers(logger, stream) {
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
    stream.on('error', (error) => {
      logger.error(`Stream event error received for ${stream.constructor.name}, exiting process now`, error);
      process.exit(1);
    });
    return stream;
  }
}

module.exports = StreamEventHandlers;