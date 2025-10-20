# Unknown Keyword Validation in OpenAPI Schemas

## Overview

This document investigates a critical aspect of OpenAPI/JSON Schema validation: **how validators handle unknown keywords in schema definitions**. Understanding this behavior is essential because it directly impacts the detection of indentation errors in YAML-based specifications.

### Why This Matters

YAML indentation errors are particularly dangerous because they can silently corrupt schema structures:
- A misplaced property moves to an incorrect schema level
- Validators treat it as an unknown keyword and ignore it (per JSON Schema specification)
- The specification passes validation successfully
- However, the schema behavior during analysis differs from what was intended

### What This Document Covers

This analysis demonstrates:
1. How unknown keywords are handled in OpenAPI 3.0.3 and 3.1.0
2. Why standard validators cannot catch indentation-related structural errors
3. Spectral's validation behavior confirming this
4. How example validation can reveal these hidden issues to a great extent

## Problem Statement

### The Core Question

**Can validators detect the indentation error in Spec 2, given that Spec 1 represents the intended schema structure?**

### The Issue

In Spec 2, the `severities` property has incorrect indentation, moving it from being a property of `ThresholdAnomaly` (as intended in Spec 1) to being a child attribute of the `commonAnomaly` property.

This creates a critical distinction:
- In **Spec 1**: `severities` is a **property** of `ThresholdAnomaly` (correctly defined under `properties`)
- In **Spec 2**: `severities` becomes an **unknown keyword** of the `commonAnomaly` schema object (at the same level as `type`)

The fundamental question becomes: **How do OpenAPI/JSON Schema validators handle unknown keywords?** Do they raise errors, issue warnings, or silently ignore them?

### Spec 1

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0
components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      properties:
        commonAnomaly:
          type: string
        severities:              # ✅ Top-level property (sibling to commonAnomaly)
          type: string
      type: object
```

### Spec 2 

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0
components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      properties:
        commonAnomaly:
          type: string
          severities:            # ❌ Indentation error: moved one level too deep
            type: string
      type: object
```



## Key Concept: Unknown Keywords Are Ignored

According to JSON Schema specifications, validators **MUST NOT raise errors** for unknown keywords. This design choice allows for:
- **Custom extensions** (like `x-custom-field`)
- **Future keyword compatibility** without breaking existing validators
- **Annotation support** for tooling

However, this behavior can **mask indentation errors** where properties are accidentally placed at the wrong schema level.

---

## Official Specification References

### OpenAPI 3.0.3

**Schema Object Definition:**  
[https://spec.openapis.org/oas/v3.0.3.html#schema-object](https://spec.openapis.org/oas/v3.0.3.html#schema-object)

**JSON Schema Core (Draft Wright 00), Section 4.4:**  
[https://datatracker.ietf.org/doc/html/draft-wright-json-schema-00#section-4.4](https://datatracker.ietf.org/doc/html/draft-wright-json-schema-00#section-4.4)

> "A JSON Schema MAY contain properties which are not schema keywords. Unknown keywords SHOULD be ignored."

### OpenAPI 3.1.0

**Schema Object Definition:**  
[https://spec.openapis.org/oas/v3.1.0.html#schema-object](https://spec.openapis.org/oas/v3.1.0.html#schema-object)

**JSON Schema Core (Draft Bhutton 01), Section 4.3.1:**  
[https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-01#section-4.3.1](https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-01#section-4.3.1)

> "A JSON Schema MAY contain properties which are not schema keywords. Unknown keywords SHOULD be treated as annotations, where the value of the keyword is the value of the annotation."

---

## Spectral Test Setup

All tests use a simple Spectral ruleset that extends standard OAS rules. The ruleset of `b.spectral.yaml` used in the test setup is a superset of the set of OAS rules used by the api-insights validator.

**b.spectral.yaml:**
```yaml
extends: ["spectral:oas"]
```

Through various scenarios, we have tried to confirm that unknown keywords are indeed ignored by the Spectral validator. However, it can identify the unknown keywords provided additionalProperties are not allowed (`additionalProperties: false`) and an example schema has been provided either at the media level or at the schema level.

---

## Scenario 1: Unknown Keyword at Wrong Level

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      properties:
        commonAnomaly:
          severities:        # ❌ Unknown keyword - NOT inside 'properties'
            type: string
        specialAnolamy:      # ✅ Correctly defined property
          type: string
      type: object
      example:
        commonAnomaly:
          severities: 4
        specialAnolamy: 10
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D

/Users/abkum3/work/minimal.yaml
 20:25  error  oas3-valid-schema-example  "specialAnolamy" property type must be string  
                components.schemas.ThresholdAnomaly.example.specialAnolamy

✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

### Analysis

- ✅ **Type error caught** for `specialAnolamy` (expected string, got integer `10`)
- ❌ **No error for `severities`** - it's silently ignored as an unknown keyword
- The validator treats `commonAnomaly` as having **no defined properties**
- `severities` in the example is also ignored because the resolved schema doesn't recognize it

---

## Scenario 2: Adding `additionalProperties: false`

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      properties:
        commonAnomaly:
          additionalProperties: false  # ← Strict mode: no extra properties allowed
          severities:                   # ← Still an unknown keyword (ignored)
            type: string
        specialAnolamy:
          type: string
      type: object
      example:
        commonAnomaly:
          severities: 4                 # ← Now violates additionalProperties!
        specialAnolamy: 10
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D

/Users/abkum3/work/minimal.yaml
 19:23  error  oas3-valid-schema-example  Property "severities" is not expected to be here  
                components.schemas.ThresholdAnomaly.example.commonAnomaly

✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

### Analysis

- ✅ **Now catches `severities` error** in the example
- Why? The resolved schema is:
  ```yaml
  commonAnomaly:
    additionalProperties: false
    # severities keyword ignored
    # No 'properties' defined
  ```
- Since `additionalProperties: false` and no properties are defined, `severities` in the example is **not allowed**
- This confirms that `severities` was **never recognized** as a property definition

---

## Scenario 3: Correct Schema Structure

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      properties:
        commonAnomaly:
          additionalProperties: false
          properties:              # ✅ Correct: properties keyword added
            severities:            # ✅ Now a proper property definition
              type: string
        specialAnolamy:
          type: string
      type: object
      example:
        commonAnomaly:
          severities: 4            # ❌ Wrong type (integer vs string)
        specialAnolamy: "10"       # ✅ Correct type
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D

/Users/abkum3/work/minimal.yaml
 21:23  error  oas3-valid-schema-example  "severities" property type must be string  
                components.schemas.ThresholdAnomaly.example.commonAnomaly.severities

✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

### Analysis

- ✅ **Type error correctly caught** for `severities` property
- Now `severities` is properly defined within `properties`
- The example validation works as expected

---

## Scenario 4: Correct Top-Level Properties

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      additionalProperties: false
      properties:
        commonAnomaly:
          type: string
        severities:              # ✅ Top-level property (sibling to commonAnomaly)
          type: string
      type: object
      example:
        commonAnomaly: "4"
        severities: "10"
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D

No results with a severity of 'error' found!
```

### Analysis

- ✅ **No errors** - schema and example are both correct
- `severities` is properly defined as a property of `ThresholdAnomaly`
- Both properties are siblings at the same level

---

## Scenario 5: Indentation Error Example when additionalProperties are not allowed

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      additionalProperties: false   # ✅  additionalProperties are NOT allowed
      properties:
        commonAnomaly:
          type: string
          severities:               # ❌ Indentation error: moved one level too deep
            type: string
      type: object
      example:
        commonAnomaly: "4"
        severities: "10"            # ❌ Not defined at this level
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D

/Users/abkum3/work/minimal.yaml
 17:15  error  oas3-valid-schema-example  Property "severities" is not expected to be here  
                components.schemas.ThresholdAnomaly.example

✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

### Analysis

- ✅ **Example validation catches the issue** - In the schema, `severities` is not defined at the `ThresholdAnomaly` level, but it has moved as an unknown keyword of `ThresholdAnomaly`, hence `severities` has been ignored altogether in the schema structure. However, in the schema example, as `ThresholdAnomaly` can have just one property named `commonAnomaly`, it now catches this issue.
- ❌ **Schema structure error not caught** - `severities` under `commonAnomaly` is ignored as an unknown keyword
- The resolved schema has:
  ```yaml
  ThresholdAnomaly:
    properties:
      commonAnomaly:
        type: string
        # severities ignored
    # No severities property defined
  ```
- This is a **common indentation mistake** that validation doesn't catch directly
- This issue could be caught by doing all of the below:
  - Enable `oas3-valid-schema-example` rule in validation
  - Provide a schema example
  - Disable additionalProperties (`additionalProperties: false`)

---

## Scenario 6: Indentation Error Example when additionalProperties are allowed

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      # additionalProperties: false    # ❌ additionalProperties are allowed
      properties:
        commonAnomaly:
          type: string
          severities:                  # ❌ Indentation error: moved one level too deep
            type: string
      type: object
      example:
        commonAnomaly: "4"
        severities: "10"               # ✅ Not defined at this level but will not be caught as additionalProperties are allowed
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D
No results with a severity of 'error' found!
```

### Analysis

- ❌ **Example validation does NOT catch the issue** - In the schema, `severities` is not defined at the `ThresholdAnomaly` level, but it has moved as an unknown keyword of `ThresholdAnomaly`, hence `severities` has been ignored altogether in the schema structure. Also, in the schema example, as `ThresholdAnomaly` can have properties additional to the defined one, i.e., `commonAnomaly`, `severities` at the example level is not caught as an incorrect schema example.
- ❌ **Schema structure error not caught** - `severities` under `commonAnomaly` is ignored as an unknown keyword

---

## Scenario 7: Indentation Error Example at media level

### Schema Definition

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0

components:
  schemas: 
    ThresholdAnomaly:
      description: Threshold type Anomaly policy definition
      additionalProperties: false
      properties:
        commonAnomaly:
          type: string
          severities:
              type: string
      type: object
paths:
  /anomaly-policies:
    get:
      summary: Get anomaly policy
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThresholdAnomaly' # ❌ Problematic schema being used here
              example:              
                commonAnomaly: "4"
                severities: "10" # ❌ Not defined at this level
```

### Validation Result

```bash
$ spectral lint -r b.spectral.yaml minimal.yaml -D

/Users/abkum3/work/minimal.yaml
 28:23  error  oas3-valid-media-example  Property "severities" is not expected to be here  paths./anomaly-policies.get.responses[200].content.application/json.example

✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

### Analysis

- ✅ **Example validation catches the issue** - In the schema, `severities` is not defined at the `ThresholdAnomaly` level, but it has moved as an unknown keyword of `ThresholdAnomaly`, hence `severities` has been ignored altogether in the schema structure. However, in the schema example, as `ThresholdAnomaly` can have just one property named `commonAnomaly`, it now catches this issue.

- The resolved schema has:
  ```yaml
  ThresholdAnomaly:
    properties:
      commonAnomaly:
        type: string
        # severities ignored
    # No severities property defined
  ```
- This **common indentation mistake** could be caught by doing all of the below:
  - Enable `oas3-valid-schema-example` and `oas3-valid-media-example` rules in validation
  - Provide a schema example at either the schema definition level or at the media level
  - Disable additionalProperties (`additionalProperties: false`)

---

## Challenge of Custom Validation Rule

While it's technically possible to create a custom Spectral rule to detect unknown keywords in schemas, this approach has significant limitations:

### Challenges:

1. **Keyword Inventory**: Would require maintaining a comprehensive list of all valid JSON Schema keywords
2. **Version Differences**: OpenAPI 3.0.x and 3.1.0 support different sets of keywords
3. **JSON Schema Evolution**: New keywords are added in each JSON Schema version
4. **Extension Keywords**: Need to handle `x-*` custom extensions properly
5. **Maintenance Burden**: List would need constant updates as specifications evolve

---

## Possible Solution

**Example Validation**: As demonstrated in Scenario 5 and Scenario 7, implementing `example validation` will help catch indentation issues to a greater extent. It can be implemented by doing the following:
- The `oas3-valid-schema-example` and `oas3-valid-media-example` rules have to be enabled in the Spectral validation.
- The OpenAPI specifications under validation should provide example(s) at either the schema definition level or at the schema consumption (media) level.
- additionalProperties should not be allowed. For that, additionalProperties shall have to be set to false (`additionalProperties: false`) in the OpenAPI specs that are under validation.
