'use strict';
module.exports = {
  "extension": ["ts"],
  "spec": "tests/**/*.spec.ts",
  "reporter": "spec",
  "require": ["ts-node/register", "source-map-support/register", "tests/hooks.ts", "tests/prepare.ts"],
  "exit": true
}