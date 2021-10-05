import {Transform, TransformCallback, TransformOptions} from 'stream';
import {GenericObjectInterface} from 'GenericObjectInterface';
/**
 * Convert a standard delta change stream event into an upsert structure that can be used
 */
export class EventStoreTransformer extends Transform {
  constructor(opts: TransformOptions) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
  }

  /**
   *
   * @param {Object} data - The chunk to be transformed. Will be object since we operate in object mode
   * @param {*} encoding - If the chunk is a string, then this is the encoding type.
   * If data is a buffer, then this is the special value - 'buffer', ignore it in this case.
   * @param {function} callback A callback function (optionally with an error argument and data) to be called
   * after the supplied data has been processed.
   *
   * @returns {Object} - The transformed event in the format
   * {
   *  _id: <change stream identifier>,
   *  event: <full document>
   * }
   */
  _transform(data: GenericObjectInterface, encoding: BufferEncoding, callback: TransformCallback): void {
    let newData;

    if (data.operationType !== 'insert') {
      newData = {
        _id: data._id,
        event: {
          type: 'NOOP'
        }
      };
    } else {
      newData = {
        _id: data._id,
        event: data.fullDocument
      };
    }
    callback(null, newData);
  }
}
