'use strict';

const config = require('config');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

let testSchema = new Schema(
  {
    'name': {
      type: String,
      required: true
    }
  },
  {
    timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'},
    collection: 'test'
  }
);

let Test = mongoose.model('Test', testSchema);
let reconnectCount = 0;
let maxReconnectCount = 10;
let reconnectWait = 5000;

/* eslint-disable no-console */
var connectWithRetry = function makeConnection() {
  mongoose.connect(config.mongo.database_host, config.mongo.options, function connection(err) {
    if (err) {
      if (reconnectCount < maxReconnectCount) {
        reconnectCount++;
        console.error('Failed to connect to mongo on startup - retrying in 5 sec');
        setTimeout(connectWithRetry, reconnectWait);
      } else {
        console.error(
          'Failed to establish a connection after %s attempts, waiting %s each time.',
          maxReconnectCount,
          reconnectWait
        );
      }
    }
  });
};
console.log('\x1b[43m\x1b[30m%s\x1b[0m', 'Attempting connection to our mongo server.');
connectWithRetry();
var db = mongoose.connection;

// We were able to establish a connection to the mongo database
db.once('open', function callback() {
  console.log('\x1b[43m\x1b[30m%s\x1b[0m', 'Connection created, trying to save to the database.');
  let testSchema = new Test({
    name: 'test write'
  });
  testSchema.save((error, response) => {
    if (error) {
      console.error('There was an error saving to the database');
      console.error(error);
      db.close();
      return process.exit(1);
    }
    console.log('\x1b[43m\x1b[30m%s\x1b[0m', 'We have made a database entry.');
    db.close(() => {
      process.exit(0);
    });
  });
});
/* eslint-enable no-console */
exports.test = function test(req, res) {
  res.render('RESPONSE HAS BEEN RENDERED');
};

/*
Reset = "\x1b[0m"
Bright = "\x1b[1m"
Dim = "\x1b[2m"
Underscore = "\x1b[4m"
Blink = "\x1b[5m"
Reverse = "\x1b[7m"
Hidden = "\x1b[8m"

FgBlack = "\x1b[30m"
FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"
*/