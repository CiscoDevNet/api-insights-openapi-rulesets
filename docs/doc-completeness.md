# Documentation Completeness Ruleset

To be considered complete in terms of API definition and documentation, an OpenAPI Specification (OAS) document must meet these requirements:

- API definition completeness (paths, schemas, response status and error codes):
  - Must be a well-formed JSON or YAML document   
  - Must have an OAS version 
  - Must be a well-formed OpenAPI document 
  - Must contain meta information about the API itself 
  - Must contain a schema definition
  - Must have response schema defined
  - Must have success status code definitions
  - Must have error status code definitions 

- Reference documentation completeness (descriptions, examples):
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