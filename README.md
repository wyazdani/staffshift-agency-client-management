# staffshift-agency-client-management

## Developer's Certificate of Origin
By making a contribution to this project, I certify that:

  (a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or

  (b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or

  (c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.

## Table Of Contents
* [Contributing Guidelines](https://github.com/A24Group/big-book-of-information/blob/master/onboarding/contributing.md)
* [Events](https://github.com/A24Group/staffshift-agency-client-management/blob/master/Events.md)
* [JWT](#jwt)
* [Onboarding Documentation](https://github.com/A24Group/big-book-of-information/tree/master/onboarding)
* [Project Design Reference Material](https://github.com/A24Group/big-book-of-information/tree/master/ddd_cqrs_eventsourcing)
* [Running the project](#running-the-project)
* [Test Cases](#test-cases)
* [VS Code Settings](#vs-code-settings)


## JWT
Use the website https://jwt.io/ to validate your jwt. The secret you need to use will be defined as api_token in config file(Remember this will differ depending on the environment)
```json
{
  "iss": "apig",
  "sub": "5799b72e8aaf4a18b74c06a6",
  "authorizarion": "Bearer 93f45dc6374035c97590d48bdbaa140be67deba5",
  "context": {
    "type": "Agency",
    "id": "59f86a039d4a5a29a6a0dff5"
  },
  "source_url": "/v1/agency/59f86a039d4a5a29a6a0dff5/candidate/59f85605e5cab96197820f1f/equality",
  "source_method": "PUT",
  "request_id": "03d3ed15-3184-4722-b258-c189ba5a3123",
  "iat": 1511446361
}
```

## Running the project
This project has a couple of moving parts. This is a typescript project, config can be found in the `tsconfig.json` file. You will need to execute `npm run build-ts` to transpile to JS code, which is located in the `outDir`.

### Development
* You can use `nodemon` during the development phase, there is currently a default config file `nodemon.json` in the repo which only runs the API portion of the application.

### Database
* `npm run migrate`

Before starting any of the applications entry points you will need to run the database migrations.

### API
* `npm run start`

### Domain Event Consumers
* `npm run start-domain-event-consumer`

### Streaming Applications
* `npm run start-streaming-application-core`

## Test Cases
* https://mochajs.org/#arrow-functions

## VS Code Settings
These are settings that are applied to the workspace, they line-up with our linting rules. These are not committed as each developer may have additional workspace configuration specific to them, IE Custom Colors per project.
These will most likely be a subset of your `.vscode/settings.json` file
Anyone is welcome to expand on these settings
```json
{
  "javascript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": false,
  "typescript.format.insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces": false,
  "typescript.preferences.importModuleSpecifier": "relative"
}
```
