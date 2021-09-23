'use strict';
const {expect} = require('chai');
const {ensureIndexExists, ensureIndexRemoved} = require('../../helpers/IndexExistsHelper');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const testSchema = new Schema({
  first_field: {
    type: String,
    required: true
  },
  second_field: {
    type: String,
    required: true
  }
});
const TestModel = mongoose.model('Tests', testSchema);
const indexObj = {
  first_field: 1,
  second_field: 1
};

describe('Index exists helper scenarios', () => {
  const testCollection = TestModel.collection;
  const indexesList = async () => await testCollection.indexes();

  /**
   * Insert a new record so that the collection gets created
   * Then reset the indexes list before each case.
   *
   * NB: expecting the length to be equal 1, because dropIndexes drop all the indexes
   * except the _id index.
   */
  beforeEach(async () => {
    await TestModel.create({
      first_field: 'one',
      second_field: 'two'
    });
    const indexesDropped = await testCollection.dropIndexes();

    expect(indexesDropped).to.be.equal(true);
    expect(await indexesList()).to.have.lengthOf(1);
  });

  it('should create an index that doesn\'t exist', async () => {
    await ensureIndexExists(testCollection, indexObj, null);
    expect(await indexesList()).to.have.lengthOf(2);
  });

  it('should not be able to create an index that does exist', async () => {
    await testCollection.createIndex(indexObj);
    expect(await indexesList()).to.have.lengthOf(2);

    const indexExists = await ensureIndexExists(testCollection, indexObj, null);

    expect(indexExists).to.be.equal(true);
    expect(await indexesList()).to.have.lengthOf(2);
  });

  it('should drop an index that does exist', async () => {
    await testCollection.createIndex(indexObj);
    expect(await indexesList()).to.have.lengthOf(2);

    await ensureIndexRemoved(testCollection, indexObj, null);
    expect(await indexesList()).to.have.lengthOf(1);
  });

  it('should not be able to drop an index that doesn\'t exist', async () => {
    const indexExists = await ensureIndexRemoved(testCollection, indexObj, null);

    expect(indexExists).to.be.equal(false);
    expect(await indexesList()).to.have.lengthOf(1);
  });
});
