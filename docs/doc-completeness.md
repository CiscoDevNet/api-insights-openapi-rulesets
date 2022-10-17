# Documentation Completeness Ruleset

The Documentation Completeness Ruleset consists of 2 domains:
- [API definition completeness](#api-definition-completeness) (paths, schemas, response status and error codes):
  - Must be a well-formed JSON or YAML document   
  - Must have an OAS version 
  - Must be a well-formed OpenAPI document 
  - Must contain meta information about the API itself 
  - Must contain a schema definition
  - Must have response schema defined
  - Must have success status code definitions
  - Must have error status code definitions 
- [Reference documentation completeness](#reference-documentation-completeness) (descriptions, examples):
  - Must have descriptions for every attribute 
  - Must have examples for every schema 


## Rules

| name_id                                  | description                                                               | severity | mitigation                                                                                                                                                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| oas[2/3]-schema                          | Malformed OAS document, not adhering to the OpenAPI v2/v3 specifications. | error    | Please fix the items identified to adhere to the OpenAPI v2/v3 specifications. [Reference](#oas23-schema-well-formed-openapi-document)                                                                                                             |
| oas-version                              | The version of OpenAPI is not specified.                                  | error    | Please add the OpenAPI attributes identified as missing and provide values for these attributes. [Reference](#oas-version-version-of-the-oas-is-missing)                                                                                           |
| info-contact                             | Info object must have `contact` object.                                   | warning  | Please add missing `contact` object. [Reference](#meta-information-about-the-api-itself)                                                                                                                                                           |
| info-description                         | Info object must have a non-empty `description`.                          | warning  | Please add missing `description`. [Reference](#meta-information-about-the-api-itself)                                                                                                                                                              |
| info-license                             | Info object must have `license` object.                                   | warning  | Please add missing `license` object. [Reference](#meta-information-about-the-api-itself)                                                                                                                                                           |
| license-url                              | License object must have a `url`.                                         | warning  | Please add missing `url`. [Reference](#meta-information-about-the-api-itself)                                                                                                                                                                      |
| oas[2/3]-missing-schema-definition       | Some schema definitions are missing.                                      | error    | Please add schema definitions for the items detected. [Reference](#oas23-missing-schema-definition-missing-schema-definition)                                                                                                                      |
| general-schema-definition                | Some schemas are partially defined.                                       | error    | Please fully describe the schema for the items detected as using object. [Reference](#general-schema-definatio-generic-schema-definition)                                                                                                          |
| oas[2/3]-missing-returned-representation | Some responses do not define a schema.                                    | error    | Please add a schema for the items detected. [Reference](#oas2-3-missing-returned-representation-missing-returned-representation)                                                                                                                   |
| success-status-code                      | Some operations do not define a success status code.                      | error    | Please add a success status code in the 1xx, 2xx or 3xx range for the items identified. [Reference](#success-status-code-missing-success-status-code)                                                                                              |
| error-status-code                        | Some operations do not define errors.                                     | warning  | Please add an error status code for the items identified. [Reference](#error-status-code-missing-error-status-codes-there-should-be-at-least-one-error-status-code-either-4xx-or-5xx-or-default-per-the-openapi-spec--search-for-default-response) |
| description-for-every-attribute          | Some attributes do not provide a description.                             | warning  | Please add a description for the items identified. [Reference](#description-for-every-attribute-descriptions-for-every-attribute)                                                                                                                  |
| examples-for-every-schema                | Examples are not provided for some of the schemas.                        | warning  | Please add examples for the schemas identified. [Reference](#examples-for-every-schemaexamples-for-every-schema)                                                                                                                                   |




## API Definition Completeness
Check the completeness of an OAS document.


###   Well-formed JSON or YAML document

- The document must be syntactically correct regarding the JSON or YAML syntax, parser should not complain

###  oas-version: Version of the OAS is missing

- The document must specify the OAS version it is supporting.


###  oas[2|3]-schema: Well-formed OpenAPI document

- The document must be syntactically correct regarding the version of OAS it declares 



###  Meta Information about the API itself

The following fields must be present (note: list of fields depend on the OAS version) 
List for OAS v2:
- info
- title
- version
- basepath
- License
- SecurityDefinitions 

List of that are implemented for this check. 
- oas[2|3]-meta-info
- info-contact
- info-description
- info-license

###  oas[2|3]-missing-schema-definition:  Missing Schema Definition

- There is no schema attribute for a component


###  general-schema-definatio:  Generic Schema Definition

- Some of the defined schema use object as a final field when describing their object structure.


### oas[2-3]-missing-returned-representation:  Missing Returned Representation

- 2XX (except 204) and 4xx responses must have a response schema defined.


### success-status-code: Missing Success Status Code

- For every operation in the OAS document, there should be at least one success status code defined.

- A successful status code is in the 1xx, 2xx or 3xx range series, and generally a 200, 201 or 204. Missing response schema object properties.

### error-status-code:  Missing Error Status Codes There should be at least one error status code either 4xx or 5xx (or default per the OpenAPI spec / search for Default Response)

- Example here: there are no error codes, only 200 OK https://wwwin-github.cisco.com/stsfartz/oas_docs/blob/master/threatresponse/raw/iroh-enrich.20220324.json#L6698



## Reference Documentation Completeness 

### description-for-every-attribute:  Descriptions for Every Attribute

- For every attribute that is present in the OAS document, if a description is proposed as optional to complement that attribute, then yes it must be present.


### examples-for-every-schema:Examples for Every Schema

- For every schema provided in the OAS document, at least one example must be present


