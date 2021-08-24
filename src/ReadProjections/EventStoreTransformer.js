'use strict';

const {Transform} = require('stream');

/**
 * Convert a standard delta change stream event into an upsert structure that can be used
 */
class EventStoreTransformer extends Transform {

  constructor(opts = {}) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
  }

  /**
   *
   * @param {Object} data - The chunk to be transformed. Will be object since we operate in object mode
   * @param {*} encoding - If the chunk is a string, then this is the encoding type. If data is a buffer, then this is the special value - 'buffer', ignore it in this case.
   * @param {function} callback A callback function (optionally with an error argument and data) to be called after the supplied data has been processed.
   *
   * @returns {Object} - The transformed event in the format
   * {
   *  _id: <change stream identifier>,
   *  operationType: <ChangeStreamEvents Enum>
   *  documentKey: <document identifier>
   *  updates: {
   *   $set: {},
   *   $unset: {}
   *  }
   * }
   */
  _transform(data, encoding, callback) {
    // What should we do if we get a non-insert operation type
    // data.operationType !== 'insert'
    let newData = {
      token: data._id,
      event: data.fullDocument
    };
    callback(null, newData);
  }
}

module.exports = EventStoreTransformer;