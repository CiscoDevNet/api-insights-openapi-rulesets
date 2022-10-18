# REST Conventions

This section proposes conventions when designing REST APIs such as naming resources and representations in order to get better consistency across APIs.

<!-- toc -->

- [REST Conventions](#rest-conventions)
  - [REST Resources](#rest-resources)
    - [Resource Names](#resource-names)
    - [Functional Resources](#functional-resources)
    - [Capitalization](#capitalization)
    - [Case Sensitivity](#case-sensitivity)
    - [Inclusive and Bias-Free Naming](#inclusive-and-bias-free-naming)
  - [REST Representations](#rest-representations)
    - [Encoding](#encoding)
    - [Returned Collections](#returned-collections)
    - [Representation Fields](#representation-fields)
    - [Data Types](#data-types)
    - [Hypermedia Links](#hypermedia-links)

<!-- tocstop -->

## REST Resources

### Resource Names

<!-- reco API.REST.CONVENTIONS.01 -->
<h6 id="API.REST.CONVENTIONS.01"></h6>

> **Recommendation** \
> SME Review: Resource names are consistent and succinct; do not use abbreviations.
<!-- recostop -->

The most intuitive REST APIs use URL patterns that humans can easily read and construct.

Above all else, be consistent in your naming and try to use short, succinct names for resources. The idea is to aid developers so that common patterns emerge and they can learn organizations APIs more easily. Generally do not use abbreviations and opt towards verbosity to aid in understanding. Even common acronyms such as product names, that may be well understood in a natural language sentence, may be very hard to understand when used as part of a resource name.

<!-- reco API.REST.CONVENTIONS.02 -->
<h6 id="API.REST.CONVENTIONS.02"></h6>

> **Recommendation** \
> SME Review: Resource names are represented as nouns (not verbs), except for functional resources.
<!-- recostop -->

Try to make sure the names will be meaningful to the API user. Keep in mind that what seems clear to you may be less clear to a novice. For instance, a distinction between "interfaceID" and "hardwareName" may require a detailed definition and examples.

Resources should be represented as **nouns** and **not verbs.** Nouns would be things like "User", "Account", "Message", "Voicemail", "File", and so on. Verbs are things like "Subscribe", or "Notify".

In most cases, you should be able to come up with ways to represent the meaning behind a verb into a noun.

For example:

```
POST /users/{id}/subscribe
```

would be more RESTful if you convert it to:

```
POST /users/{id}/subscriptions
```

### Functional Resources

<!-- reco API.REST.CONVENTIONS.03 -->
<h6 id="API.REST.CONVENTIONS.03"></h6>

> **Recommendation** \
> SME Review: Functional resources use a verb-noun or verb pattern, and expose POST operations.
<!-- recostop -->

Functional resources generally expose a POST operation, with a naming pattern in the form of `verb-noun` or sometimes just `verb`. This makes it easy for the developer to understand it is a functional resource, rather than a resource collection that often follows the pluralized noun format (e.g. projects, accounts, customers). 

### Capitalization 

<!-- reco API.REST.CONVENTIONS.04 -->
<h6 id="API.REST.CONVENTIONS.04"></h6>

> **Recommendation** \
> Linter Rule - REST.API.CONVENTIONS.resource-lower-camel-case-[info|error]: Resource names use lowerCamelCase.
<!-- recostop -->

For capitalization, your API should be using _lowerCamelCase_ unless a convention has already been established for a published pre-existing API. You should capitalize with lowerCamelCase as many REST artefacts as possible, including paths, resources, representations.

Examples :
- [/resourceGroups](https://developer.webex.com/docs/api/v1/resource-groups/list-resource-groups) 

Acronyms should not be ALLCAPS and instead follow the lowerCamelCase conventions. As an example, if 'URL' is used in a resource name, the resource path should be named as `publicUrl`.

Keep in mind that acronyms or even combinations of words may be hard to parse, especially for those API users who are not familiar with the terms or not native speakers of English. Using lowerCamelCase will help by marking where each word begins. For instance, a field named hardwarePhysicalInterface will be easier to understand than hwphysicalinterface.

An exception to the _lowerCamelCase_ capitalization rule is HTTP headers, where the industry standard is Capitalized-Hyphenated-Terms, or Capital-Kebab-Case.

### Case Sensitivity

Your API design, implementation and documentation process should be conducted with case-sensitivity in mind.

As recommended above, your API should be using 'lowerCamelCase' as much as possible when naming paths for API resources, and also for the representations fields used in requests/responses.

When documenting your API, you should use the exact same naming conventions used in your API design. Doing so, developers should expect requests to fail when incorrect casing is specified for paths or fields. Typically, your developer audience should expect an operation defined and documented as `GET /peopleCount` to return a '404 Not Found' if invoked as `GET /peoplecount`.

It is left to you as the API provider to opt for a permissive implementation or not. 
An example of a permissive implementation would support both /peopleCount and /peoplecount paths in the example above. 
Though the general practice would be to provide a not permissive implementation, and return a 404 if the requested path does not match the exact casing defined and documented for an API resource.

If you end up opting for a permissive implementation (aka supporting case-insensitive paths), we recommend to rewrite internally resource path via the routing service of your API rather then redirecting the consumer via a '302 Found' status code.

### Inclusive and Bias-Free Naming 

Your API design, documentation, and implementation must use bias-free and inclusive language where customer-facing, and we encourage careful consideration of language choice in source code also. Specifically, eliminate the use of "master/slave" and "whitelist/blacklist." Refer to the [Cisco API Guidelines Inclusive and Bias-free Language](https://developer.cisco.com/api-guidelines/#!apix-documentation/documenting-apis) for guidance on replacements and alternatives.

## REST Representations

### Encoding

The format of representations used in request/responses should be based on established industry or domain standards. For example, RESTCONF defines a standard for Network Devices based on YANG. Check [Networking Fundamentals](https://developer.cisco.com/api-guidelines/#!devices-restconf) for prescriptive guidance regarding RESTCONF.

When such standards do not exist, your API should pick among generic structured format such as JSON, YAML or XML.

<!-- reco API.REST.CONVENTIONS.05 -->
<h6 id="API.REST.CONVENTIONS.05"></h6>

> **Recommendation** \
> SME Review: My API uses JSON as the default encoding for representations.
<!-- recostop -->

If a consumer does not specify a specific format via the `Accept` header, your API should respond in the JSON format as a default, unless JSON is not supported.

_Note that when creating new APIs, you should support JSON as the default format for all operations. Pre-existing APIs using alternative formats should consider supporting JSON as part of their roadmap and the next major version of their API._

<!-- reco API.REST.CONVENTIONS.06 -->
<h6 id="API.REST.CONVENTIONS.06"></h6>

> **Recommendation** \
> Linter Rule - REST.API.CONVENTIONS.oas-application-json-charset-utf8-required: JSON representations are declared using the 'application/json' or 'application/json; charset=UTF-8' content types.
<!-- recostop -->

The media type to be used in HTTP requests and responses must be specified as `Content-Type: application/json`, optionally qualified with a `charset=UTF-8` parameter as in `Content-Type: application/json; charset=UTF-8`.

If this qualification is absent, it is assumed that the entity data is encoded as UTF-8.

**API operations should not return the result as an execution status in the response payloads**

The success or failure of an API request should be reflected in the [HTTP status code](#http-status-code) of the response. In case of error, the response representation should provide additional details about the nature of the failure, as detailed in the [Error Handling](https://developer.cisco.com/api-guidelines/#!rest-patterns/error-handling) section in REST Patterns.

### Returned Collections

<!-- reco API.REST.CONVENTIONS.07 -->
<h6 id="API.REST.CONVENTIONS.07"></h6>

> **Recommendation** \
> Linter Rule - API.REST.CONVENTIONS.oas-collections-returned-as-arrays: Collections are returned as arrays encapsulated with a named field such as 'items'.
<!-- recostop -->

Operations may return a collection of objects as their response. The actual set of objects returned may be implicit as with a GET/READ operation on a CRUD-based API, or explicit as with a filter and query parameters as described in [filtering](#filtering).

When responding with a collection of objects, operations should return an array encapsulated with a named field. The preferred label for this named field is `items` as in the example below:

```json
{
    "items": [
        {
            "id": "1234",
            "title": "The Tempest"
        },
        {
            "id": "5678",
            "title": "Hamlet"
        }
    ]
}
```

_Note that using an encapsulated array is a pattern which brings extra flexibility to the design of APIs, with the possibility to support capabilities such as providing a count of the returned objects or returning a list of not found items in a query._

APIs should return 'full' representations for singleton or collection responses by default, or may provide clients with the ability to request 'summary' representations including only key fields as a performance optimization for larger collections. See [Partial retrieval](https://developer.cisco.com/api-guidelines/#!rest-patterns/partial-retrieval) in the REST patterns section for further guidance.

### Representation Fields

<!-- reco API.REST.CONVENTIONS.08 -->
<h6 id="API.REST.CONVENTIONS.08"></h6>

> **Recommendation** \
> Linter Rule - API.REST.CONVENTIONS.oas-field-names-lower-camel-case: Representation field names use lowerCamelCase.
<!-- recostop -->

The general recommendation - detailled in the [Designing REST APIs](https://developer.cisco.com/api-guidelines/#rest-conventions/representation-fields) section - to use lowerCamelCase for capitalization also applies to the fields of your API operations representations.

When naming representation fields:

  *  Begin with lowercase letters
  *  Prefer camelCase over under_scores
  *  Choose meaningful and succinct names
  *  Don't reuse any names reserved for other purposes
  *  Avoid internal naming conflicts, e.g. reusing names for dissimilar purposes
  *  [(_INVESTIGATING_)](../introduction.md#classes-of-recommendations)
 Follow [SCIM Schema](http://www.simplecloud.info/specs/draft-scim-core-schema-01.html) naming conventions when a field represents data from a directory system

<!-- reco API.REST.CONVENTIONS.09 -->
<h6 id="API.REST.CONVENTIONS.09"></h6>

> **Recommendation** \
> SME Review: Representation fields use plural noun names for collections.
<!-- recostop -->

When naming representation fields:

  *  Use plural nouns for arrays
  *  Use singular nouns for non-arrays

Example:

```json
{
  "id": "Y2lzY29zcGFyazovL3VzL1BFT1BMRS9mNWIzNjE4Ny1jOGRkLTQ3MjctOGIyZi1mOWM0NDdmMjkwNDY",
  "emails": [
    "john.andersen@example.com"
  ],
  "displayName": "John Andersen",
  "nickName": "John",
  "firstName": "John",
  "roles": [
    "Y2lzY29zcGFyazovL3VzL1JPTEUvOTZhYmMyYWEtM2RjYy0xMWU1LWExNTItZmUzNDgxOWNkYzlh",
    "Y2lzY29zcGFyazovL3VzL1JPTEUvOTZhYmMyYWEtM2RjYy0xMWU1LWIyNjMtMGY0NTkyYWRlZmFi"
  ],
  "created": "2015-10-18T14:26:16.000Z",
  "lastModified": "2015-10-18T14:26:16.000Z"
}
```



### Data Types 

Representations for CRUD-based API Resources must include identifiers, generally as an `id` field. 

Identifiers should be advertised to consumers as opaque, and should not be predictable or associated with the data itself, as detailled in [Constructing resource identifiers](https://developer.cisco.com/api-guidelines/#!rest-design/constructing-resource-identifiers).

<!-- reco API.REST.CONVENTIONS.10 -->
<h6 id="API.REST.CONVENTIONS.10"></h6>

> **Recommendation** \
> Linter Rule - oas-no-boolean-string-enums: Representation fields use format-native true/false values for booleans.
<!-- recostop -->

Boolean fields should use the native boolean type representation (e.g. `true`/`false` for JSON) over non-standard strings containing 'True', 'False', 'yes', 'no', etc. such as in:

```json
{
   "something": true
}
```

<!-- reco API.REST.CONVENTIONS.11 -->
<h6 id="API.REST.CONVENTIONS.11"></h6>

> **Recommendation** \
> SME Review: Representation fields use strings in 'iso-date-time' format (RFC-3339) for date/time.
<!-- recostop -->

Date and time fields must be represented as strings and formatted according to [RFC-3339](https://tools.ietf.org/html/rfc3339), specifically the ABNF syntax specification for `iso-date-time`.

```json
{
   "timestamp": "2018-10-02T10:00:00.00Z"
}
```

<!-- reco API.REST.CONVENTIONS.12 -->
<h6 id="API.REST.CONVENTIONS.12"></h6>

> **Recommendation** \
> SME Review: Representation fields use integer whole seconds for durations.
<!-- recostop -->

Duration fields should be represented as integer whole seconds

### Hypermedia Links

Hypermedia-powered APIs have long been considered by many in the industry as being the way to implement data linkages across multiple resources or APIs, with identifiers to related data items implemented as links rather than as a simple surrogate or canonical identifier.

However, doing so cohesively across an organization demands a (rare) singularity of purpose.
Moreover, there are times when including rather than linking to data for the purposes of efficiency is desirable. 
