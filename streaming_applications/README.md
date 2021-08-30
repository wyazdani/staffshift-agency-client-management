# Streaming Applications within this project
Covers the various streaming applications and their purpose

# NB
CONSIDER THE LEGACY SYNC PROCESS USING THE READER AND WRITER FOR ANY STREAMING APPLICATION FUNCTIONALITY YOU ADD.

### AgencyGroupCandidateDetails
This Materialised view is a grouping of the most frequently called API endpoints. This will allow users to rather watch the MV and handle delta's sequentially than use our current domain events via pub sub that may be out of sequence and then calling the related API endpoint to get the most recent data.
* Watches:
  * AgencyGroupCandidateBasicInfo

#### NB
At the time of writing the current business and system logic dictated that a candidates basic info could not be deleted. However there is a legacy sync process that actually deletes and then inserts the new values. We are in the process of deprecating the related screens and routes. Until then this MV would need to hide the fact that this takes place and as such should not "replicate" the delete event.

# Change Streams aka Streaming Applications
Streaming applications will be defined based on their destination perspective. This means that we will most likely have more open change streams than we actually require
There are a couple of things to consider here though as each streaming application could watch the same collection with different rules IE resume tokens. I still feel that the current approach splits the code logically and at a later stage we can introduce a watcher class manager that could be used to pool the watchers with the same configuration. I dont want to over complicate / over engineer the POC.

## Adding a new Streaming Application
* Create new folder
  * Create your watch file and get a watcher context (a)
  * Create your seed file which must satisfy interface (b)
  * Create a pipeline folder which contains the streams for your application
    * Create your pipeline file which must satisfy interface (c)

### (a) The watch interface
This is the class that will deal with the change events during runtime.  You can get your watcher context using
```js
const Watcher = require('../core/Watcher');
Watcher.getWatcherContext('AgencyGroupCandidateDetails', pipelines);
```
* The first param is the streaming applications name, which will most likely be the folder of your watcher
* The second param is an array of pipelines that make up your atreaming application

### (b) The seed interface
This is the class that will be used to populate the data from the source, and does not handle any change events.
* `async seed(section, logger, tokenManager)` - Basically calls your implemented seed methods

### (c) The pipeline interface
* `static getType()` - Determines the pipelines role `CORE` or `ENRICHMENT`
* `static getMongoClientConfigKeys()` - Should return array of database config keys your pipeline is using
* `static async watch(logger, tokenManager)` - Your watch method that should apply a resume token if one is found

## Implementing your Streaming Application
See https://github.com/A24Group/big-book-of-information/blob/master/change_streams.md for more details.
Currently each pipeline will only watch 1 source. This guide is based on this implementation. If you are looking to have a single pipeline watch many sources you will need to create new pipeline components.
* The watch file
  * Identifies your streaming application name which is used within Ansible configuration to actually deploy it
* The seed file
  * Should mimic your pipeline, but the source is a cursor rather than an a change event
  * Seeds must run in sections (a section is considered a single pipeline within the streaming application), if you need to seed across sections consider creating a sync process
* The pipeline watch file
  * Defines the chain of transformers and writers that deal with your event

### Pipeline Watch file
* `PIPELINE_ID` - pipeline identifier
* `WATCH_ID` - The resume token identifer
* `WATCH_COLLECTION` - The collection name that will be watched
* `WRITE_COLLECTION` - The collection to which you are going to write to

### Pipeline Components
* Transformer streams
  * Rules / Insights - TBA
* Duplex stream
  * Rules / Insights - TBA
* Writer stream
  * Rules / Insights - TBA


### BasicReadWrite
Generic read write (duplex) component that will persist your set and unset statements. This is a convience component and you are allowed to implement your own should you require something else. This component does not do an upsert, if update statement has a match count of 0 an error is thrown.
For more implementation details see the component.

### ChangeStreamDeltaTransformer
Generic change event pipeline component that will convert your change event into set and unset statements. This is a convience component and you are allowed to implement your own should you require something else.

### FullDocumentSeedTransformer
Generic seed pipeline component that will convert your full document read into set statements. This is a convience component and you are allowed to implement your own should you require something else.

### ResumeTokenWriter
This is a writer stream and should be used as the final component on your pipeline. There should be no need to implement your own. This component can be used for both the change stream and the seed pipelines.

### Watcher
This will construct and configure a watcher context for you. It prevents the duplication of boilerplate code.

### Deploying your streaming application
There is already a streaming application playbook in ansible. You should now update it to include your application. You need to configure the core and enrichment streams (enrichment is optional). Even though there is a single playbook, the microservice deployer needs to be updated, not for the deploy but for the check it actually does to ensure that the deployment has completed. Take note of https://kubernetes.io/docs/concepts/overview/working-with-objects/names/, your deployment name is only allowed to be 63 characters, all lowercase characters. You should use the existing examples in the `ss-permissions-streaming-applications.yml` playbook for naming conventions.
Since each ENV has its own DB name, you will need to update the vaults and add the required pipeline DB names to each.

## MongoClients
This class is a basic wrapper that will init database connections and determine pool size at runtime. We should always have 1 connection per change stream.
When adding your watcher / change stream you should not need to make any changes to this class.
The class expects your configuration in the format:
```json
{
  "mongo": {
    "database_host": "mongodb://127.0.0.1:27017/staffshiftbumblebeeDev",
    "options": {
      "useNewUrlParser": true,
      "useUnifiedTopology": true
    }
  }
}
```

## DatabaseConfigKeys
This contains the database config keys, and ensures that we re-use the same values when defining the mongo client config keys

## StreamEventHandlers
This attaches the generic event handlers. If you need more custom handlers you are free to attach your own instead.

## ResumeTokenCollectionManager
Basic Writeable resume token stream manager. This is a WIP and will most likely need updates