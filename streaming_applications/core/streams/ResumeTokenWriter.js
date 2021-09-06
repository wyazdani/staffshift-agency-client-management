'use strict';

const {Writable} = require('stream');

/**
 * Upserts a resume token to the specified collection.
 * Using the persist rate you can reduce the number of token writes for fast moving data
 *  This would mean a resume might replay a couple of events, use with caution
 */
class ResumeTokenWriter extends Writable {
  /**
   *
   * @param {String} opts._id - Identifier to be used for the updateOne
   * @param {Object} opts.collection - The collection object that will be used for the updateOne
   * @param {Number} opts.persistRate - Will persist the token every X events
   */
  constructor(opts) {
    // We only cater for object mode
    opts.objectMode = true;
    super(opts);
    this.counter = 0;
    this.isFirstTime = true;
    this._id = opts._id;
    this.collection = opts.collection;
    this.persistRate = opts.persistRate || 1;
  }

  _write(data, encoding, next) {
    this.counter++;
    if (this.counter >= this.persistRate || this.isFirstTime) {
      this.isFirstTime = false;
      this.collection.updateOne(
        {_id: this._id},
        {
          $set: {token: data._id},
          $inc: {total: this.counter},
          $currentDate: {updated_at: true},
          $setOnInsert: {
            created_at: new Date()
          }
        },
        {upsert: true},
        (err) => {
          this.counter = 0;
          next(err);
        });
      return;
    }
    next();
  }
}

module.exports = ResumeTokenWriter;