'use strict';
module.exports = {
  "extension": ["ts"],
  "spec": "tools/tests/**/*.spec.ts",
  "reporter": "spec",
  "require": ["ts-node/register", "source-map-support/register", "tools/tests/prepare.ts"],
  "exit": true
}