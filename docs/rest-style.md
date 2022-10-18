# REST Style

This section proposes best practices and recommendations to apply consistent RESTful designs to Web APIs.

<!-- toc -->

- [REST Style](#rest-style)
  - [Applying HTTP methods](#applying-http-methods)
    - [GET](#get)
    - [POST](#post)
    - [PUT](#put)
    - [DELETE](#delete)
    - [PATCH](#patch)
    - [HEAD](#head)
    - [OPTIONS](#options)
    - [REST Indempotency](#rest-indempotency)
  - [Using HTTP headers](#using-http-headers)
    - [Standard Request Headers](#standard-request-headers)
      - [Accept Header](#accept-header)
    - [Standard Response Headers](#standard-response-headers)
      - [TrackingID Header](#trackingid-header)
      - [Cache-Control Headers](#cache-control-headers)
      - [CORS Headers](#cors-headers)
  - [Using Query Parameters](#using-query-parameters)
    - [Filtering](#filtering)
    - [Sorting](#sorting)
    - [Pagination](#pagination)
  - [Returning HTTP Status Codes](#returning-http-status-codes)
    - [Mapping HTTP Methods with Status Codes](#mapping-http-methods-with-status-codes)
    - [GET Responses](#get-responses)
    - [POST Responses](#post-responses)
    - [PUT Responses](#put-responses)
    - [DELETE Responses](#delete-responses)

<!-- tocstop -->

## Applying HTTP methods

REST operations must use the appropriate HTTP methods (aka verbs) whenever possible.

Below is a list of methods that API resources may support. 
_Note that your API and its resources do not need to support every method listed._

| Method  | Description |
|---------|-------------|
| GET     | Return the current value of an object |
| POST    | Create a new object based on the data provided, or submit a command |
| PUT     | Replace an object, or create a named object, when applicable |
| DELETE  | Delete an object |
| PATCH   | Apply a partial update to an object |
| HEAD    | Return metadata-only of an object |
| OPTIONS | Get metadata-only information about an object |

### GET

<!-- reco API.REST.STYLE.01 -->
<h6 id="API.REST.STYLE.01"></h6>

> **Recommendation** \
> SME Review: GET requests have no (apparent) effect on the state of resources.
<!-- recostop -->

The GET verb is be used for retrieving representational state from a resource. 

Such a request must have no apparent affect on the state of the resource.  However, side effects may include incidental changes in state of the server, other resources, or client-invisible fields of the target resource itself, as might be expected in cases where view counts or client metrics are being tracked.

A successful GET response should return HTTP `200 OK`.

Any data in the request body accompanying a GET request should be ignored by the operation.

### POST

<!-- reco API.REST.STYLE.02 -->
<h6 id="API.REST.STYLE.02"></h6>

> **Recommendation** \
> Linter Rule - API.REST.STYLE.post-header*: POST operations which create objects return the new object's canonical link in a 'Location' header.
<!-- recostop -->

In general, a POST operation is used to _create_ a new resource.

The request body contains a representation of the object to be created.

For example, to create a new document, you would design the operation as follows:

```
POST /documents

{
    "title": "My New doc",
    "type": "text/text",
    "author": "Jane Doe"
}
```

<!-- reco API.REST.STYLE.03 -->
<h6 id="API.REST.STYLE.03"></h6>

> **Recommendation** \
> Linter Rule - API.REST.STYLE.oas2-post-201-created: POST operations which create objects return 201 Created, with a full or reference-only representation.
<!-- recostop -->

The POST response should return HTTP `201 Created` along with a full representation of the new object, including any fields which may have been populated due to defaults or by the operation.

The full URL where the created object is accessible should be returned via the `Location` header, as in the 'full representation' example response below:

```
HTTP/1.1 201 Created
Location: http://api.example.com/v1/documents/35bd3e

{
    "id": "35bd3e",
    "title": "My New doc",
    "type": "text/text",
    "author": "Jane Doe",
    "content": "...",
    "createdAt": "20180630 10:10:00",
    "createdBy": "jdoe"
}
```

Optionally, HTTP `201 Created` may be returned, including just the new unique identifier for the object, as in this 'reference-only response' example:

```
HTTP/1.1 201 Created
Location: http://api.example.com/v1/documents/35bd3e

{
    "id": "35bd3e"
}
```

If your API offers [action resources](#action-resources), HTTP status may also be returned as `200 OK`. See [HTTP Status Codes](#http-status-codes) for additional applicable result codes.

### PUT

<!-- reco API.REST.STYLE.04 -->
<h6 id="API.REST.STYLE.04"></h6>

> **Recommendation** \
> API.REST.STYLE.put-200-204-success: PUT operations return either '200 OK' with full representation or '204 No Content'.
<!-- recostop -->

The PUT verb may be used in any case where a client requests the complete replacement of a resource.  The request contains a full representation of the replacement resource.

A PUT operation should provide a `200 OK` status code and include a full representation of the updated object. 

Optionally, `204 No Content` is possible if no representation is returned.

Extra considerations for PUT operations:

<!-- reco API.REST.STYLE.05 -->
<h6 id="API.REST.STYLE.05"></h6>

> **Recommendation** \
> SME Rewiew : If a client-modifiable field is omitted, PUT operations result in the field removed or set to default.
<!-- recostop -->

A client-modifiable field omitted from the new representation - but present in the original object - results in the object resource having the field effectively removed or set to default.

<!-- reco API.REST.STYLE.06 -->
<h6 id="API.REST.STYLE.06"></h6>

> **Recommendation** \
> SME Review: If a non-client-modifiable field is omitted, PUT operations retain the value of the field.
<!-- recostop -->

If a non-client-modifiable field is omitted, the value of the field is retained from the original object

<!-- reco API.REST.STYLE.07 -->
<h6 id="API.REST.STYLE.07"></h6>

> **Recommendation** \
> SME Review: If a non-client-modifiable field has a value different from original, PUT operations fail with '400 Bad Request'.
<!-- recostop -->

If a non-client-modifiable field is included, but has a different value from the original object, the API request should fail, and return `400 Bad Request`.

### DELETE

<!-- reco API.REST.STYLE.08 -->
<h6 id="API.REST.STYLE.08"></h6>

> **Recommendation** \
> Linter Rule: API.REST.STYLE.delete-204-success: DELETE operations return '204 No Content' on success.
<!-- recostop -->

The DELETE verb should be interpreted as a request to delete the specified resource.

The request must fail in the event no resource exists with the given path.

Any request body data accompanying a DELETE request should be ignored by the operation.

A successful DELETE response should provide a HTTP `204 No Content` status code.

### PATCH

<!-- reco API.REST.STYLE.09 -->
<h6 id="API.REST.STYLE.09"></h6>

> **Recommendation** \
> SME Review: Representations for PATCH requests are formatted as JSON Merge Patch (RFC-7396).
<!-- recostop -->

The PATCH verb may be used for submitting partial updates to a resource.  

In general, replacing a complete object via PUT will be the main (simplest) approach for object state modification, however there may be optimization scenarios where allowing partial updates can save bandwidth/processing resources, or could help with concurrency (multiple clients updating an object in race conditions.)

Basic PATCH functionality should allow a partial representation to be submitted, which contains only fields which should be modified in the target object.  For JSON representations, this should be based on [JSON Merge Patch](https://tools.ietf.org/html/rfc7396)

With this example of an original object:

```json
{
    "id": "987654321",
    "title": "Goodbye!",
    "author" : {
        "givenName" : "John",
        "familyName" : "Doe"
     },
    "tags":[ "example", "sample" ],
    "content": "This will be unchanged"
}
```

In order to make the following changes:

- Change the value of the "title" field from "Goodbye!" to "Hello!"
- Add a new "phoneNumber" field
- Remove the "familyName" field from the "author" object
- Replace the "tags" array so that it doesn't include the word "sample"

An API consumer would send the request below:

```
PATCH /authors/987654321
Content-Type: application/merge-patch+json

{
    "title": "Hello!",
    "phoneNumber": "+11234567890",
    "author": {
        "familyName": null
    },
    "tags": [ "example" ]
}
```

Which would result in a response such as:

```
HTTP/1.1 200 OK

{
    "id": "987654321",
    "title": "Hello!",
    "author" : {
        "givenName" : "John"
    },
    "tags": [ "example" ],
    "content": "This will be unchanged",
    "phoneNumber": "+11234567890"
}
```

<!-- reco API.REST.STYLE.10 -->
<h6 id="API.REST.STYLE.10"></h6>

> **Recommendation** \
> Linter Rule: API.REST.STYLE.patch-200-204-success: PATCH operations return either '200 OK' with full representation or '204 No Content'.
<!-- recostop -->

A successful PATCH response would typically return a HTTP `200 OK` status code and include the updated object's full representation in the body; 

However it is also acceptable to return `204 No Content` with no body.

<br/>
[(_INVESTIGATING_)](../introduction.md#classes-of-recommendations)

In some cases, ambiguities - especially involving defaults and empty vs. null scenarios - may require a patching mechanism that is more robust than simple field replacement. 

See the [JSON Patch](https://tools.ietf.org/html/rfc6902) specification as a possible mechanism for specifying detailed and formal patch instructions for PATCH operations.

### HEAD

<!-- reco API.REST.STYLE.11 -->
<h6 id="API.REST.STYLE.11"></h6>

> **Recommendation** \
>Linter Rule: API.REST.STYLE.oas2-head-operations-[match-headers-with-get|no-body]: HEAD operations are supported with responses headers identical to the corresponding GET and no body content.
<!-- recostop -->

Your API may support HEAD verbs in conformance with the [HTTP standard](https://tools.ietf.org/html/rfc2616#section-9.4) for this method, i.e. return headers identical to a corresponding GET request, but without any response body content.

Any request body data accompanying a HEAD request must be ignored by the operation.

### OPTIONS

An API may support OPTIONS requests for scenarios such as:

- Implementing [CORS](https://www.w3.org/TR/cors/) to enable secure browser-based usage of the API, see ["CORS Support"](https://developer.cisco.com/api-guidelines/#rest-security/cors-support)
- Providing 'discovery' capabilities per resource, primarily for clients to query/negotiate support for particular HTTP verbs and/or request/response content formats, see [RFC-2616](https://tools.ietf.org/html/rfc2616#section-9.2)

Any request body data accompanying an OPTIONS request should be ignored by the operation.

An API operation might require authorization for OPTIONS for method/format discovery purposes, however OPTIONS must not require authorization for CORS request flows, as this will break CORS pre-flight requests.

### REST Indempotency

Unsafe API operations can be made more resilient and predictable by enforcing indempotency where appropriate, meaning that repeating the operation with the same details will result in the same state.  This makes situations where update operations fail ambiguously (e.g. a timeout occurs and it's not clear whether the server processed the request or not) easier to recover from, i.e. by just repeating the request.

For example, DELETE operations are indempotent - the operation `DELETE /quizzes/{id}` can be performed multiple times with the result always being the same: the specified object remains deleted.

Idempotency in REST does not mean that consecutive calls to the same method and resource must return the same response, but rather that consecutive calls to the same method and resource should result in the same intended effect on the server.  For example, the initial DELETE request on a resource returns 204, while a repeated request on the same resource returns 404.

POST operations are not indempotent.

**Example Request**:

```
POST /quizzes HTTP/1.1
```

**Example Response**:

```
HTTP/1.1 201 Created
Location: https://api.example.com/v1/quizzes/35bd3e

{
    "id" : "35bd3e"
}
```

Note that the state will be different upon repeating such a POST request, i.e. new objects (with different returned object IDs and resource URIs) would be created each time the request is repeated.

PATCH operations are also non-indempotent.

Repetitions of a PATCH request could result in different object state depending on whether or not the target resource was changed by another entity in between PATCH's.

<!-- reco API.REST.STYLE.12 -->
<h6 id="API.REST.STYLE.12"></h6>

> **Recommendation** \
> SME Review: My API operations are implemented to conform with REST Indempotency.
<!-- recostop -->

Your API should implement its operations to conform with expected indempotency based on the following table:

| Method  | Description | Indempotent|
|---------|-------------|------------|
| GET     | Return the current value of an object| True |
| PUT     | Replace an object based on the data provided | True |
| DELETE  | Delete an object | True |
| POST    | Create a new object based on the data provided, or submit a command | False |
| HEAD    | Return metadata-only of an object | True |
| PATCH   | Apply a partial update to an object | False |
| OPTIONS | Get information about a request | True |


## Using HTTP headers

### Standard Request Headers

<!-- reco API.REST.STYLE.13 -->
<h6 id="API.REST.STYLE.13"></h6>

> **Recommendation** \
> Linter Rule: API.REST.STYLE.oas-request-header-date-correct-[type|regex] : HTTP headers follow the syntax specified in the corresponding RFCs.
<!-- recostop -->

The table of request headers below should be used by REST-based APIs.

Using these headers is not mandated, but if used they must be used consistently.

All header values must follow the syntax rules set forth in the specification where the header field is defined.

Many HTTP headers are defined in [RFC7231](https://tools.ietf.org/html/rfc7231), however a complete list of approved headers can be found in the [IANA Header Registry](https://www.iana.org/assignments/message-headers/message-headers.xhtml).

Header                            | Type                                  | Description
--------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Authorization                     | String                                           | Authorization header for the request
Date                              | Date                                             | Timestamp of the request, based on the client's clock, in [RFC 7231](https://tools.ietf.org/html/rfc7231#section-7.1.1.1) date and time format. The server should not make any assumptions about the accuracy of the client's clock. This header is optional in the request, but must be in this format when supplied.  Greenwich Mean Time (GMT) must be used as the time zone reference for this header when it is provided. For example: `Wed, 24 Aug 2016 18:41:30 GMT`. Note that GMT is exactly equal to UTC (Coordinated Universal Time) for this purpose.
Accept                            | Content type                                     | The requested content type for the response such as: <ul><li>application/xml</li><li>text/xml</li><li>application/json</li><li>text/javascript (for JSONP)</li></ul>Per the HTTP guidelines, this is just a hint and responses may have a different content type, such as a blob fetch where a successful response will just be the blob stream as the payload.
Accept-Encoding                   | Gzip, deflate                                    | REST APIs should support standard compression encodings, when applicable (see the [HTTP spec](https://tools.ietf.org/html/rfc2616#section-3.5))
Accept-Language                   | "en", "es", etc.                                 | Specifies the preferred language for the response. Operations are not required to support this, but if an operation supports localization it must do so through the Accept-Language header.
Accept-Charset                    | Charset type like "UTF-8"                        | Default is UTF-8, but operations should be able to handle ISO-8859-1.
Content-Type                      | Content type                                     | Mime type of request body (PUT/POST/PATCH)
If-Match, If-None-Match, If-Range | String                                           | Operations that support updates to resources using optimistic concurrency control must support the [If-Match header](https://tools.ietf.org/html/rfc7232) to do so. Operations may also use other headers related to ETags as long as they follow the HTTP specification. See ["Concurrency Control"](https://developer.cisco.com/api-guidelines/#rest-patterns/concurrency-control) patterns for more details.

#### Accept Header

<!-- reco API.REST.STYLE.14 -->
<h6 id="API.REST.STYLE.14"></h6>

> **Recommendation** \
> SME Review : When requests include an 'Accept' header, operations return representations in the requested type or an error.
<!-- recostop -->

If a request includes an HTTP `Accept` header, the operation must return a resource representation corresponding to a type presented in that header, or return an appropriate error code.  

Exceptions include the `application/x-www-form-urlencoded` and `text/plain` formats, which should be treated as if the client had requested JSON representation format.

<!-- reco API.REST.STYLE.15 -->
<h6 id="API.REST.STYLE.15"></h6>

> **Recommendation** \
> SME Review: In absence of an 'Accept' header, operations return JSON representations by default
<!-- recostop -->

Absence of an `Accept` header in a request should be regarded as acceptance by the client of responses with JSON formatted resource representations, if JSON is a supported format.

When responding to a request with an error code, the operation may return a JSON formatted response payload regardless of the presence or contents of an `Accept` header in the original request.

### Standard Response Headers

<!-- reco API.REST.STYLE.16 -->
<h6 id="API.REST.STYLE.16"></h6>

> **Recommendation** \
> Linter Rule: API.REST.STYLE.date-response-header-*: All responses include a 'Date' header in the GMT timezone and RFC 7231 format.
<!-- recostop -->

<!-- reco API.REST.STYLE.17 -->
<h6 id="API.REST.STYLE.17"></h6>

> **Recommendation** \
> SME Review: Responses with a body include matching 'Content-Type' and 'Content-Encoding' headers when applicable.
<!-- recostop -->

API operations should return the following response headers when appropriate.

| Header | Type | Description |
| ------ | ---- | ----------- |
| Date   | date/time |  Timestamp the response was processed, based on the server's clock, in [RFC 7231](https://tools.ietf.org/html/rfc7231#section-7.1.1.1) date and time format. This header must be included in the response. GMT must be used as the time zone reference for this header. |
| Content-Type | string | The [MIME](https://en.wikipedia.org/wiki/MIME) content type of the response body |
| Content-Encoding | string | GZIP or DEFLATE, as appropriate |
| ETag | string | Provides the current value of the entity tag for the requested variant. Used with If-Match, If-None-Match and If-Range to implement optimistic concurrency control |

#### TrackingID Header

<!-- reco API.REST.STYLE.18 -->
<h6 id="API.REST.STYLE.18"></h6>

> **Recommendation** \
> Linter Rule: API.REST.STYLE.tracking-id-header-*: All responses include a 'TrackingID' header.
<!-- recostop -->

Your API operations should include a unique `TrackingID` header with every response.

This TrackingID is intended to identify the operation/transaction across time and space, as a key for later support and serviceability needs, including trace log analysis across multiple nodes/instances.

The actual informational content of the `TrackingID` header can be opaque to the API user, but could incorporate multiple pieces of info helpful to the [support team](../products/supporting.md), including:

* Processing entity identifier: to identify the operation/node/instance that handled the request (and where the corresponding trace logs would be found)
* A globally unique transaction identifier: i.e. a UUID
* A transaction sequence number or timestamp: helpful for race condition or async issue analysis
* Arbitrary name/value pairs: as appropriate to aid post-mortem analysis

<!-- reco API.REST.STYLE.19 -->
<h6 id="API.REST.STYLE.19"></h6>

> **Recommendation** \
> SME Review: TrackingIDs are traceable in the logs of my API.
<!-- recostop -->

When logging activities related to the production of a response to an API call, an operation should include the corresponding `TrackingID` as part of the log message.

This permits for back-end correlation of log information useful for troubleshooting.

#### Cache-Control Headers

<!-- reco API.REST.STYLE.20 -->
<h6 id="API.REST.STYLE.20"></h6>

> **Recommendation** \
> Linter Rule - API.REST.STYLE.etag-header-match-required | no-etag-cache-control-header-required : Either 'ETag/If-Match/If-None-Match' or 'Cache-Control' headers are used to manage caching.
<!-- recostop -->

Operations should support the `ETag` header in any HTTP response where it is reasonable for clients or proxies to cache the associated resource representation.

In cases where `ETag` is supported, such resources should also support `If-Match` and `If-None-Match` request headers, see [HTTP conditional requests](https://tools.ietf.org/html/rfc7232).

Also, refer to the ["Conditional Requests"](https://developer.cisco.com/api-guidelines/#!rest-patterns/conditional-requests) and ["Concurrency Control"](https://developer.cisco.com/api-guidelines/#rest-patterns/concurrency-control) patterns for more details on how to apply ETags in your design.

**Where caching is not appropriate**, operations must include a `Cache-Control` header (e.g. max-age=0, no-cache, no-store, must-revalidate) and must not include an `ETag` header.

#### CORS Headers

A REST API which could conceivably serve browser-based clients must support CORS simple and preflight request flows and headers, see [CORS Support](./security.md#cors-support) for prescriptive guidance.


## Using Query Parameters

<!-- reco API.REST.STYLE.21 -->
<h6 id="API.REST.STYLE.21"></h6>

> **Recommendation** \
> SME Review : CRUD operations are designed using identifiers in the path; not via query parameters.
<!-- recostop -->

Query parameters should be used to limit or manipulate the grouping of items returned by a resource that returns a collection.  

Query parameters should NOT be used to indicate specific individual resources; instead, you should use URI resource paths for this purpose.

As an example, to retrieve the representation for a quiz instance, use a design such as `GET /quizzes/{quizzId}` and not `GET /quizzes?id={quizzId}`.

### Filtering

Filtering restricts the number of queried resources by specifying some attributes and their expected values as key/value pairs.

It is possible to filter a collection on several attributes at the same time, and to allow several values for one filtered attribute:

- Example with multiple filters: `GET /users?lastName=Doe&firstName=Jane`
- Example with a repeated attribute: `GET /users?id=234&id=643&id=877`

Check the [Advanced Querying](https://developer.cisco.com/api-guidelines/#rest-patterns/advanced-querying) section for querying best practices that go beyond simple filtering.

### Sorting

<!-- reco API.REST.STYLE.22 -->
<h6 id="API.REST.STYLE.22"></h6>

> **Recommendation** \
> SME Review: Sorting collections is designed with a 'sort' query parameter.
<!-- recostop -->

A `sort` parameter should contain the attributes on which the sorting is performed, separated by commas.

**Example of a sort query with multiple attributes:**

```
GET /documents?sort=author,publishedDate
```

<!-- reco API.REST.STYLE.23 -->
<h6 id="API.REST.STYLE.23"></h6>

> **Recommendation** \
> Linter Rule - API.REST.STYLE.oas-order-parameter-asc-desc | sort-recommend-order : Ordering collections is designed with an 'order' query parameter specifying 'asc' or 'desc'.
<!-- recostop -->

An `order` parameter m  ay indicate the ascending/descending order of the sorting, using either the `asc` or `desc` values.

**Example of a sort query with descending order:**

```
GET /documents?sort=publishedDate&order=desc
```

For querying requirements that go beyond simple sort, see the [Query Syntax](https://developer.cisco.com/api-guidelines/#!rest-patterns/query-syntaxes) section.

### Pagination

<!-- reco API.REST.STYLE.24 -->
<h6 id="API.REST.STYLE.24"></h6>

> **Recommendation**
> SME Review: Pagination is designed using a 'max' query parameter and 'Link' headers per RFC 5988.
<!-- recostop -->

Operations may support pagination for `GET` methods which return collections of resources, particularly when hundreds or more items are returned.

If supported, the operation must accept a `max` query parameter specifying the maximum number of objects to be returned.

If the number of the returned collection of objects is greater than `max`, operations should provide `Link` headers to navigate pages.

Per [RFC 5988](https://tools.ietf.org/html/rfc5988), use URL pointing to the `next`, `previous`, `start`or `last` sets of results, as appropriate. Note that links other than `next` are optional.

**Example of an operation proposing pagination when returning a collection with 100+ objects**

```
GET /documents?max=100

HTTP/1.1 200 OK
Link: <https://api.example.com/v1/documents?cursor=Y2lzY29zcGFyazov&max=100>; rel="next"
Link: <https://api.example.com/v1/documents?cursor=Y2lzY29rte536ssf&max=100>; rel="prev"

{
    "items": [
        ...
    ]
}
```

<!-- reco API.REST.STYLE.25 -->
<h6 id="API.REST.STYLE.25"></h6>

> **Recommendation**
> SME Review: Pagination is designed with opaque cursors unless offset-based pagination is a required use case.
<!-- recostop -->

'Link' URLs are assumed to be **opaque cursors** to the API consumer as in the example above.

The design of your cursors may include additional parameters convenient to implement your API's actual pagination mecanism. Cursors could be implemented as an obfuscated unique key, a database cursor handle, or some other internal identifier useful in efficiently retrieving the desired collection/position. Being considered 'opaque', the consumer would not be expected to understand or generate these cursors ad hoc.

<!-- reco API.REST.STYLE.26 -->
<h6 id="API.REST.STYLE.26"></h6>

> **Recommendation**
> SME Review: When supporting offset-based pagination, operations use 'offset' and 'max' query parameters in 'Link' headers.
<!-- recostop -->

If jumping straight to a particular page in a range (e.g., 100-150 of 200) is a required use-case, you should consider a design **using non-opaque offset-based query parameters**, as in the example below.

_Note that the link URL's `offset` parameter is calculable, giving consumers the ability to construct URLs for retrieving specific pages from collections returned by operations._

```
GET /files/documents?max=50

HTTP/1.1 200 OK
Link: <https://api.example.com/v1/documents?offset=100&max=50>; rel="next"
Link: <https://api.example.com/v1/documents?offset=0&max=50>; rel="prev"

{
    "items": [
        ...
    ]
}
```


## Returning HTTP Status Codes

<!-- reco API.REST.STYLE.27 -->
<h6 id="API.REST.STYLE.27"></h6>

> **Recommendation** \
> Linter Rules: API.REST.STYLE.respond-with-recommended-*-codes | status-codes-in-2xx-4xx-5xx : My API responds with recommended HTTP status codes in the 2xx/4xx/5xx ranges.
<!-- recostop -->

RESTful APIs use HTTP status codes to specify the outcomes of HTTP method execution. The HTTP protocol specifies the outcome of a request execution using an integer and a message. The number is known as the _status code_ and the message as the _reason phrase_. The reason phrase is a human readable message used to clarify the outcome of the response. 

The HTTP protocol categorizes status codes in ranges:

* HTTP Status Codes [RFC 7231](https://tools.ietf.org/html/rfc7231#section-6.1)
* Additional HTTP Status Codes [RFC 6585](https://tools.ietf.org/html/rfc6585)

When responding to API requests, the following status code ranges should be used:

| Range | Meaning |
| --- | --- |
| `2xx` |Successful execution. It is possible for a method execution to succeed in different ways, this status code specifies which way it succeeded |
| `4xx` |Problems with the request, the data in the request, invalid authentication or authorization, etc. In most cases the client can modify/correct the request and resubmit |
| `5xx` | Server error: The server was not able to execute the request due to site outage, software defect, or some other unexpected. 5xx range status codes should not be utilized for validation or logical error handling |

Addition guidelines for HTTP status codes usage:

* Don't invent new HTTP status codes; only use standardized HTTP status codes, consistent with their intended semantics
* Use the most specific HTTP status code for your processing status or error situation
* If using HTTP status codes that are less commonly used, provide extensive guidance in your API documentation
* Check this handy guide providing hints and decision flow-charts around choosing the best status code for particular situations: [Choosing an HTTP Status Code](https://www.codetinkerer.com/2015/12/04/choosing-an-http-status-code.html)

REST APIs should generally use the status codes list below:

| Status Code | Description                  |
|-------------|------------------------------|
| `200 OK` | Generic successful execution |
| `201 Created` | Used as a response to `POST` method execution to indicate successful creation of a resource.
| `202 Accepted` | Used for asynchronous method execution to specify the server has accepted the request and will execute it at a later time |
| `204 No Content` | The server has successfully executed the method, but there is no entity body to return |
| `400 Bad Request` | The request could not be understood by the server. Use this status code to specify:<br/> <ul><li>The data as part of the payload cannot be converted to the underlying data type</li><li>The data is not in the expected data format</li><li>A required field is not available.</li><li>Simple data validation type error</li></ul>|
| `401 Unauthorized` | The request requires authentication and none was provided. Note the difference between this and `403 Forbidden` |
| `403 Forbidden` | The client is not authorized to access the resource, although it may have valid credentials. APIs could use this code in case of business level authorization failure. For example, account holder does not have enough funds |
| `404 Not Found` | The server has not found anything matching the request URI. This either means that the URI is incorrect or the resource is not available. For example, it may be that no data exists in the database at that key |
| `405 Method Not Allowed` | The server has not implemented the requested HTTP method. This is typically default behavior for API frameworks |
| `406 Not Acceptable` | The server must return this status code when it cannot return the payload of the response using the media type requested by the client. For example, if the client sends an `Accept: application/xml` header, and the API can only generate `application/json`, the server must return `406` |
| `409 Conflict` | Request cannot be completed due to conflict, e.g. when two clients try to create the same resource or if there are concurrent, conflicting updates |
| `410 Gone` | Resource does not exist any longer, e.g. when accessing a resource that has intentionally been deleted |
| `415 Unsupported Media Type` | The server must return this status code when the media type of the request's payload cannot be processed. For example, if the client sends a `Content-Type: application/xml` header, but the API can only accept `application/json`, the server must return `415` |
| `422 Unprocessable Entity` | The requested action cannot be performed and may require interaction with APIs or processes outside of the current request. This is distinct from a 500 response in that there are no systemic problems limiting the API from performing the request |
| `429 Too Many Requests` | The server must return this status code if the rate limit for the user, the application, or the token has exceeded a predefined value |
| `500 Internal Server Error` | This is either a system or application error, and generally indicates that although the client appeared to provide a correct request, something unexpected has gone wrong on the server. A `500` response indicates a server-side software defect or site outage. `500` should not indicate client request validation errors |
| `501 Not Implemented` | Not Implemented - server cannot fulfill the request (usually implies future availability, e.g. new feature) |
| `503 Service Unavailable` | The server is unable to handle the request for an operation due to temporary maintenance |

### Mapping HTTP Methods with Status Codes

For each HTTP method, your API operations should use only status codes marked as "X"  in this table: 

_Note that status codes marked with a bold **`X`** are rarely used_

| Status Code               | `GET`   | `POST`  | `PUT`   | `PATCH` | `DELETE` |
|---------------------------|---------|---------|---------|---------|----------|
| 200 OK                    | X       | X       | X       | X       | X        |
| 201 Created               |         | X       |         |         |          |
| 202 Accepted              |         | **`X`** | **`X`** |         |          |
| 204 No Content            |         |         | X       | X       | X        |
| 400 Bad Request           | X       | X       | X       | X       | X        |
| 404 Not Found             | X       | **`X`** | X       | X       | X        |
| 422 Unprocessable Entity  | **`X`** | **`X`** | **`X`** | **`X`** | **`X`**  |
| 500 Internal Server Error | X       | X       | X       | X       | X        |

### GET Responses

<!-- reco API.REST.STYLE.28 -->
<h6 id="API.REST.STYLE.28"></h6>

> **Recommendation** \
> SME Review: When returning empty collections, operations return '200 OK' and an 'items' field with a zero-length array.
<!-- recostop -->

The purpose of the `GET` method is to retrieve an API resource. 

On success, a status code `200 OK` and a response with the content of the resource is expected, generally represented as a single object or a collection of objects.

In cases where a GET operation returns an empty collection, the `200 OK` status code should be used, with a representation containing an empty  [encapsulated array](https://developer.cisco.com/api-guidelines/#rest-conventions/returned-collections), as in the example below:

```json
{
   "items": []
}
```

### POST Responses

<!-- reco API.REST.STYLE.29 -->
<h6 id="API.REST.STYLE.29"></h6>

> **Recommendation** \  
> SME Review: Requests attempting to create a sub-resource for a primary resource that is non-existent return '404 Not Found'.
<!-- recostop -->

**In CRUD-based designs**, the primary purpose of `POST` operations is to create a resource. 

If the resource was successfully created as part of the execution, a `201 Created` status code should be returned with a reference to the resource created as described in [POST](#post).

If if an operation attempts to create a sub-resource for a primary resource that is non-existent, `404 Not Found` is the appropriate status code response.

**When invoking functional resources**, `200 OK` status code is generally the appropriate status code for successful execution of 'POST' operations. see [Extending CRUD with Functional Resources](https://developer.cisco.com/api-guidelines/#rest-design/extending-crud-with-functional-resources) for more details.

### PUT Responses

When successful, 'PUT' operation should return a `204 No Content` status code as there is no need to return any content in most cases as the request is to update a resource and it was successfully updated. The information from the request should not be echoed back.

In rare cases, server generated values may need to be provided in the response, to optimize the API consumer flow. For example, consider an operation that generates unspecified fields such as defaults, that would otherwise require the consumer to perform an additional `GET` operation after the `PUT` invocation. In such cases, `200 OK` with a response body are appropriate.

### DELETE Responses

When successful, 'DELETE' operations should return a `204 No Content` status code with no body as there is no need to return the deleted content.