# staffshift-agency-client-management

Onboarding Documentation can be found [here](https://github.com/A24Group/big-book-of-information/tree/master/onboarding)

## Table Of Contents
* [Contributing Guidelines](https://github.com/A24Group/big-book-of-information/blob/master/onboarding/contributing.md)
* [JWT](#jwt)
* [Project Design Reference Material](https://github.com/A24Group/big-book-of-information/tree/master/ddd_cqrs_eventsourcing)
* [Running the project](#running-the-project)
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

### Database
* `npm run migrate`

Before starting any of the applications entry points you will need to run the database migrations.

### API
* `npm run start`

### Domain Event Consumers
* `npm run start-domain-event-consumer`

### Streaming Applications
* `npm run start-streaming-application-core`

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
