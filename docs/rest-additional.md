# REST Additional

This section proposes additional best practices and recommendations for more consistency of APIs.

## Error Handling

Just like an HTML error page shows a useful error message to a visitor, an API should provide a useful error message in a consumable format. 

The API definition - typically using OpenAPI specifications - and API reference documentation should include detailed descriptions about errors that may be returned by operations: these descruotuibs are part of your API contract, and provide important information for developers to handle correctly these situations and helps with troubleshooting.

### HTTP Status Codes

As detailled in section [Returning HTTP Status Codes](./rest-style.md#returning-http-status-codes), your API should return standardized HTTP status codes whose values meet the expectations of the developer community given the outcome of operations.

API errors typically break down into 2 types: 
- _4xx_ series status codes for client issues, 
- and _5xx_ series status codes for server issues.

At a minimum, the API should standardize that all _4xx_ series errors come with defined, machine-consumable error representations. 

When possible, this should extend to _5xx_ series status codes (i.e. if load balancers & reverse proxies can create custom error bodies).

### Error Representations

<!-- reco API.REST.PATTERNS.01 -->
<h6 id="API.REST.PATTERNS.01"></h6>

> **Recommendation** \
> Linter Rule - API.REST.PATTERNS.oas-error-message : Error representations include a useful human-readable message.
<!-- recostop -->

The representation of an error should be no different than the representation of any resource, just with its own defined schema, fields and data.

An error representation should provide several items relevant for the consumer: 
- certainly a useful human-readable error message; 
- possibly a unique error type/code (that can be looked up for more details in the docs); 
- ideally, a detailed description/breakdown with hints as to what went wrong and how to fix it.

The simplest example just provides a human-readable `message` field giving a brief description of the error:

```json
{
    "message": "Incomplete request object"
}
```

The HTTP status code of the response will indicate the general error category of an error, but it may be appropriate to provide a more detailed machine-readable error code that can be mapped to a table of known error conditions:

```json
{
    "code": "3006",
    "message": "Incomplete request object"
}
```

Even more helpful responses might include a detailed error description, perhaps including suggestions on how to correct the error:

```json
{
    "code": "3006",
    "message": "Incomplete request object",
    "description": "Required field 'lastName' is missing'
}
```

Validation errors with PUT, PATCH and POST requests may wish to provide a field-level breakdown. For example, this could be modeled using a fixed top-level error code, with detailed errors in an 'errors' array:

```json
{
  "code": "1024",
  "message": "User object validation failed",
  "errors": [
    {
      "code": "5432",
      "field": "firstName",
      "message": "firstName cannot have fancy characters"
    },
    {
      "code": "5622",
      "field": "password",
      "message": "Password cannot be blank"
    }
  ]
}
```

### Processing Errors

A server may choose to stop processing as soon as a problem is encountered, or it may continue processing and encounter multiple problems. For instance, a server might process multiple attributes and then return multiple validation problems in a single response.

When a server encounters multiple problems for a single request, the most generally applicable HTTP error code should be used in the response. For instance, `400 Bad Request` might be appropriate for multiple _4xx_ errors or `500 Internal Server Error` might be appropriate for multiple _5xx_ errors.

### Troubleshooting 

<!-- reco API.REST.PATTERNS.02 -->
<h6 id="API.REST.PATTERNS.02"></h6>

> **Recommendation** \
> Linter Rule - API.REST.PATTERNS.error-response-identifier: Error representations include an identifier to help with troubleshooting.
<!-- recostop -->

As troubleshooting errors will commonly involve analyzing trace logs, it is important that your API implements [TrackingID headers](./rest-style.md#trackingid-header).

Such identifiers - or any other identifier which can help pinpoint errors all the way to your API logs - should also be added to error representations.

As an example, this is a Webex error message returned for a misplace `GET https://webexapis.com/v1/people` request:

```json
{
  "message": "Email, displayName, or id list should be specified.",
  "trackingId": "WEBEX-DEV-PORTAL_4bb4729e-28f3-4484-8435-bc65dd1721be_4"
}
```
