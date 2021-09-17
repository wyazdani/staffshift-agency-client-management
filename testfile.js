'use strict';

const A24NodeTestUtils = require('a24nodetestutils');
const MBService = A24NodeTestUtils.MbService;
const Mocha = require('mocha');
const fs = require('fs');
const _ = require('lodash');
const config = require('config');
const mbService = new MBService(config);
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const async = require('async');

const excludedEnv = ['beta', 'production', 'sandbox', 'default'];
if (process.env.NODE_ENV === undefined || excludedEnv.indexOf(process.env.NODE_ENV) !== -1) {
  // eslint-disable-next-line no-console
  console.log('Cannot run test cases from environment ' + process.env.NODE_ENV);
  return process.exit(1);
}

const options = {
  'reporter': config.mocha.reporter
};

// Instantiate a Mocha instance.
const mocha = new Mocha(options);
const testDir = './tests/';
// List of directories that will run at the end
const excludedDir = ['endpoint'];
// To run only specific unit tests add your class here in as
// 'handlers/amqp/message-notification-handler-test.js'
const customDir = [
];

// Add excluded directories that need to run last
const addEndPointTests = function addEndpoints(callback) {
  async.each(excludedDir, (file, callback) => {
    mbService.isRunning(function isRunning(err, isRunning) {
      if (isRunning === false) {
        return process.exit();
      }
      readTestDir(testDir + file + '/');
      callback();
    });
  }, () => {
    return callback();
  });

};

let runner = null;

// Execute all tests added to mocha runlist
const runMocha = function runMocha() {
  runner = mocha.run(function run(failures) {
    process.on('exit', function onExit() {
      process.exit(failures);  // exit with non-zero status if there were failures
    });
  });
  // Listen to the end event to kill the current process
  runner.on('end', function endProcess() {
    process.exit(0);
  });
};

// Load the files into mocha run list if the file ends with JS
// This means the test directories can only have test and NO code files
const loadFiles = function loadTestFiles(file, path) {
  // eslint-disable-next-line no-sync
  const pathStat = fs.statSync(path);
  if (pathStat && pathStat.isDirectory() && excludedDir.indexOf(file) === -1) {
    // If current file is actually a dir we call readTestDir. This will make the function
    // recursive until the last tier
    readTestDir(path + '/');
  } else if (file.substr(-3) === '.js') {
    mocha.addFile(path);
  }
};

// Read all files/dirs recursively from the specified testing directory
const readTestDir = function readTestDirectory(path) {
  // Project is still small so can do it synchronous
  try {
    // eslint-disable-next-line no-sync
    const files = fs.readdirSync(path);
    files.forEach(
      function forEach(file) {
        loadFiles(file, path +  file);
      }
    );
  } catch (error) {
    // if error is about non existing file/directory just log it and continue
    if (error.code === 'ENOENT') {
      // eslint-disable-next-line no-console
      console.log('Could not load files from directory', {path});
      return;
    }
    throw error;
  }
};

const dropDatabase = function dropDatabase(callback) {
  mongoose.connect(config.mongo.database_host, config.mongo.options, function connectToDatabase() {
    mongoose.connection.db.dropDatabase(function dropTestingDatabase() {
      mongoose.connection.close(() => {
        const app = require('./');
        return callback();
      });
    });
  });
};

if (isEmpty(customDir)) {
  dropDatabase(function dropDatabase() {
    // Read all files/dirs recursively from the specified testing directory
    readTestDir(testDir);
    // Adding exclusions(end point are part of this as we need time for the node server to start). Exclusion dirs
    // will be added to run last
    addEndPointTests(function addEndPointTests() {
      // Execute the mocha tests
      runMocha();
    });
  });
} else {
  dropDatabase(function dropDatabase() {
    mbService.isRunning(function isRunning() {});
    // Allow devs to run only specific unit test classes
    customDir.forEach(
      function forEach(path) {
        loadFiles(path, testDir + path);
      }
    );
    // Execute the mocha tests
    runMocha();
  });
}
