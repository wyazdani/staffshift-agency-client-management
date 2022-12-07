# Generate Command Schemas

This script will read all command interfaces from `aggregates` folder and generates `command-schemas` folder.

We defined test cases locally in specific folder to prevent it running on CI, since it increases build time.
If you changed any line in the generator make sure you'll update the test cases.

Command to run test cases: `npm run test-tools`
Command to run generator: `npm run dev-generate-command-schemas`
