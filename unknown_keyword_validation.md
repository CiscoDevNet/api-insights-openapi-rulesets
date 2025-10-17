# Unknown Keyword Validation in OpenAPI Schemas

## Overview

This document explains how OpenAPI/JSON Schema validators handle **unknown keywords** in schema definitions, and why **indentation errors** can go undetected during validation. Understanding this behavior is critical for avoiding subtle bugs in OpenAPI specifications.

## Key Concept: Unknown Keywords Are Ignored

According to JSON Schema specifications, validators **MUST NOT raise errors** for unknown keywords. This design choice allows for:
- **Custom extensions** (like `x-custom-field`)
- **Future keyword compatibility** without breaking existing validators
- **Annotation support** for tooling

However, this behavior can **mask indentation errors** where properties are accidentally placed at the wrong schema level.

---

## Test Setup

All tests use a simple Spectral ruleset that extends standard OAS rules:

**b.spectral.yaml:**
```yaml
extends: ["spectral:oas"]
```

This includes built-in rules like `oas3-valid-schema-example` and `oas3-valid-media-example`.

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

## Scenario 5: Indentation Error Example

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
          severities:            # ❌ Indentation error: moved one level too deep
            type: string
      type: object
      example:
        commonAnomaly: "4"
        severities: "10"         # ❌ Not defined at this level
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

- ✅ **Example validation catches the issue** - `severities` not defined at `ThresholdAnomaly` level
- ❌ **Schema structure error not caught** - `severities` under `commonAnomaly` is ignored as unknown keyword
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

## Why a Custom Validation Rule Is Challenging

While it's technically possible to create a custom Spectral rule to detect unknown keywords in schemas, this approach has significant limitations:

### Challenges:

1. **Keyword Inventory**: Would require maintaining a comprehensive list of all valid JSON Schema keywords
2. **Version Differences**: OpenAPI 3.0.x and 3.1.0 support different sets of keywords
3. **JSON Schema Evolution**: New keywords are added in each JSON Schema version
4. **Extension Keywords**: Need to handle `x-*` custom extensions properly
5. **Maintenance Burden**: List would need constant updates as specifications evolve

### Alternative Approach:

**Example Validation**: The `oas3-valid-schema-example` and `oas3-valid-media-example` rules could be turned on in the spectral validation. This would help identify such indentaion issues provided example(s) have been added in the spec file. This will also report an error if a required property is missing in the example.


