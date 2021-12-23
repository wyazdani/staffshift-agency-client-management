import {ObjectID} from 'mongodb';
import {Transform, TransformCallback, TransformOptions} from 'stream';
interface ChangeEventInterface {
  _id: ObjectID;
  created_at: Date;
}
/**
 * Convert a cursor stream into expected stream structure
 *   Handles the Mongo Cursor Stream items
 */
export class EventStoreProjectionSeedTransformer extends Transform {
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
   *  operationType: SEED,
   *  event_meta: {
   *    event_id: <event_store_id>,
   *    actioned_at: <event_created_at>
   *  }
   * }
   */
  _transform(data: ChangeEventInterface, encoding: BufferEncoding, callback: TransformCallback): void {
    callback(null, {
      operationType: 'SEED',
      event: data,
      seed_meta: {
        event_id: data._id,
        actioned_at: data.created_at
      }
    });
  }
}
