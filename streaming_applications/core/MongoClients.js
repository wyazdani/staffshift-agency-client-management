'use strict';

const config = require('config');
const {MongoClient} = require('mongodb');

let configKeys = {};
let clients = {};

/**
 * Basic connection manager to ensure we have one connection with a sane pool size
 * Expects the config key to have the structure {database_host: <connection string>, options: {}}
 */
class MongoClients {

  /**
   * Wrapper to easily get a database instance of a client
   *
   * @param {Object} logger - Instance of the logger
   * @param {String} configKey - The config key
   *
   * @returns {MongoClient.db}
   */
  static async getClientDatabase(logger, configKey) {
    const client = await MongoClients.getClient(logger, configKey);
    return client.db();
  }

  /**
   * Returns an instance of the client, ensures we only have 1 instance with a runtime determined pool size
   *
   * @param {Object} logger - Instance of the logger
   * @param {String} configKey - The config key
   *
   * @returns {MongoClient}
   */
  static async getClient(logger, configKey) {
    if (clients[configKey]) {
      return clients[configKey];
    }
    const options = {poolSize: (configKeys[configKey] > 5) ? configKeys[configKey] : 5, ...config.get(`${configKey}.options`)};
    const client = new MongoClient(config.get(`${configKey}.database_host`), options);
    clients[configKey] = client;
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db().command({ping: 1});
    logger.info('Connection successful', {config_key: configKey});
    return clients[configKey];
  }

  /**
   * Simply counts the number of instances using the keys
   *   We use this to set the pool size at runtime
   *
   * @param {String|Array<String>} configKeyListing - The config keys
   */
  static registerClientConfigs(configKeyListing) {
    if (typeof configKeyListing == String) {
      return _applyKeyCount(configKeyListing);
    }
    for (let item of configKeyListing) {
      _applyKeyCount(item);
    }
  }
}

/**
 * Basic counter method
 *
 * @param {String} key - The config key
 */
function _applyKeyCount(key) {
  if (configKeys[key]) {
    configKeys[key]++;
  } else {
    configKeys[key] = 1;
  }
}

module.exports = MongoClients;