# staffshift-portfolios
Staffshift portfolios

## Making use of private npm modules
We have tried to centralise some of the commonly used code into private npm repos.
You will need to have access to each of these to do an npm install
* https://github.com/A24Group/a24-logzio-winston
* https://github.com/A24Group/a24-node-query-utils
* https://github.com/A24Group/a24-node-error-utils
* https://github.com/A24Group/A24NodeTestUtils

You will need to familiarise with each of these before writing any code on this project.
If there are any questions / bugs / suggestions, contact the relevant person so they are able
to create a ticket on the related project.

## Documentation
Listing of documentation that may prove useful
* [sinon](http://sinonjs.org/releases/) - Make sure you view the docs of the correct version, see the `package.json` for more details.
* [eslint](http://eslint.org/) - Make sure you view the docs of the correct version, see the `package.json` for more details.

## Contributing to the Project
[Here](https://github.com/A24Group/big-book-of-information/blob/master/CONTRIBUTING.md) is a detailed look at the process to follow.

### Developer's Certificate of Origin
By making a contribution to this project, I certify that:

* (a) The contribution was created in whole or in part by me and I have the right to submit it under the open source license indicated in the file; or

* (b) The contribution is based upon previous work that, to the best of my knowledge, is covered under an appropriate open source license and I have the right under that license to submit that work with modifications, whether created in whole or in part by me, under the same open source license (unless I am permitted to submit under a different license), as indicated in the file; or

* (c) The contribution was provided directly to me by some other person who certified (a), (b) or (c) and I have not modified it.


## Example JWT

 Use the website https://jwt.io/ to validate your jwt. The secret you need to use will be defined as `api_token` in config file(Remember this will differ depending on the environment)

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



## Example of Staffshift Audit

**Note** you'll need add JWT verification for Staffshift audits to work.

Add the audit event to your route with JWT: See `x-octophant-event` property
```yaml
     get:
       x-swagger-router-controller: "Candidate"
       x-octophant-event: agency_group_candidate_equality_viewed
       operationId: "getCandidateEquality"
       security:
         - jwt: []
```

In the controller pass on the instance auditor.
```javascript
module.exports.upsertCandidateEquality = function upsertCandidateEquality(req, res, next) {
  let candidateService = new CandidateService(req.Logger, req.octophant);
  candidateService.upsertCandidateEquality(req.swagger.params, res, next);
};

```

In your service class store the instance of the auditor.
```javascript
  constructor(logger, auditor) {
    this.logger = logger;
    this.auditor = auditor;
   }
```

Example of how to do an audit in a service class
```javascript
function doAuditAndRespond(logger, auditor, res, responseObject) {
  auditor.doAudit('candidate', responseObject.candidate_id, (err) => {
    if (err) {
      logger.crit(
        'Audit failed for upsertCandidateEquality event',
        {
          candidate_id: responseObject.candidate_id,
          original_error: err
        }
      );
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(responseObject));
  });
}

```

