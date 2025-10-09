# Nested Broken References Detection - Solution Summary

## Problem Statement

The Spectral validator `validation.js` was not catching two types of issues:

1. **Broken `$ref` references** like `#/components/schemas/PolicySeverity` in nested structures within sibling properties of another `$ref`
2. **Undefined required properties** where properties are listed in the `required` array but not defined in the `properties` object

The original issue #48 reported is [here](https://wwwin-github.cisco.com/DevNet/api-insights-support/issues/48). 

## Root Cause Analysis

### Issue 1: Broken Nested References

In OpenAPI 3.1.x, the specification allows `$ref` to have sibling properties at the same level while OAS 3.0.x doesn't allow this:

```yaml
commonAnomaly:
  $ref: '#/components/schemas/CommonAnomalyPolicy'
  severities:  # Sibling property - valid in OAS 3.1.x but invalid in OAS 3.0.x
    type: array
    items:
      $ref: '#/components/schemas/PolicySeverity'  # Nested ref
```

The broken reference `#/components/schemas/PolicySeverity` was not being caught in both OAS 3.0.x and 3.1.x specs.

### Issue 2: Undefined Required Properties

Properties listed in the `required` array but not defined in the `properties` object:

```yaml
TestSchema:
  type: object
  properties:
    commonAnomaly:
      type: object
    # severities property is missing but listed in required
  required:
    - commonAnomaly
    - severities  # This property is required but not defined in properties
```

### Why These Issues Weren't Caught

1. **Broken References**: 
   - **In OAS 3.0.x**: Spectral ignored sibling properties of `$ref`, so validation never reached nested `$ref`
   - **In OAS 3.1.x**: Spectral resolves `$ref` references during parsing, merging siblings. By the time validation runs, nested broken `$ref` is absorbed into resolved schema

2. **Undefined Required Properties**:
   - Spectral's default `oas3-schema` ruleset does not validate that all properties in `required` array are defined in `properties` object
   - This is a common issue in real-world OpenAPI specifications

## Solution Implemented

### 1. `broken-internal-refs` Rule

**File**: [functions/validateRefSiblings.js](/functions/validateRefSiblings.js)

**Purpose**: Catches broken `$ref` references that are nested within sibling properties of another `$ref`.

**How It Works**:
1. Runs on the **unresolved document** (before Spectral processes `$ref` references)
2. Identifies objects that have both a `$ref` and sibling properties
3. Recursively searches sibling properties for nested `$ref` references
4. Validates each nested `$ref` against the document data
5. Reports broken references with clean error messages

**Key Features**:
- Works with `resolved: false` flag to run before reference resolution
- Handles deeply nested structures
- Supports arrays and complex object hierarchies
- Ignores external references (HTTP/HTTPS/file paths)
- Only validates internal references (starting with `#/`)
- Clean error message format: `"broken reference '#/components/schemas/Reference'"`

### 2. `undefined-required-properties` Rule

**File**: [functions/validateRequiredProperties.js](/functions/validateRequiredProperties.js)

**Purpose**: Validates that all properties listed in the `required` array are defined in the `properties` object.

**How It Works**:
1. Identifies object schemas with both `required` array and `properties` object
2. Compares required properties against defined properties
3. Reports missing properties with clear error messages
4. Works across all schema locations (components, responses, request bodies, parameters)

**Key Features**:
- Validates all OpenAPI schema locations
- Clean error message format: `"'propertyName' is not defined"`
- Handles edge cases (empty arrays, non-object schemas)
- Works with both OpenAPI 3.0.x and 3.1.x

### 3. Updated `validation.js` Ruleset

**File**: [validation.js](/validation.js) 

**Changes**:
- Added import for `validateRefSiblings` and `validateRequiredProperties`
- Created `broken-internal-refs` rule with `resolved: false`
- Created `undefined-required-properties` rule for comprehensive schema validation
- Configured both rules with appropriate `given` paths and error severity

### 4. Comprehensive Test Suites

#### Unit Tests

**Files**: 
- [functions/validateRefSiblings.spec.js](/functions/validateRefSiblings.spec.js)
- [functions/validateRequiredProperties.spec.js](/functions/validateRequiredProperties.spec.js)

**Coverage**:
- Basic validation (null inputs, missing data)
- Valid references/properties (should pass)
- Broken references/missing properties (should fail)
- Multiple errors in single schema
- Deeply nested structures
- External references (should be ignored)
- Edge cases (null values, primitives, empty objects)

#### Integration Tests

**Files**:
- [test/integration/broken-internal-refs.test.js](/test/integration/broken-internal-refs.test.js)
- [test/integration/broken-refs-yaml.test.js](/test/integration/broken-refs-yaml.test.js)
- [test/integration/undefined-required-properties.test.js](/test/integration/undefined-required-properties.test.js)
- [test/integration/undefined-properties-yaml.test.js](/test/integration/undefined-properties-yaml.test.js)

**Coverage**:
- OpenAPI 3.0.3 and 3.1.0 scenarios
- Real-world scenarios from `manage.yaml`
- Request/response/parameter schema validation
- Mixed valid and invalid scenarios
- External references handling
- Complex nested structures

#### Test Resource Files

**Directory**: [test/resources/](/test/resources/)

**Broken References Tests**:
- [broken-refs/broken-internal-refs-3.0.x.yml](/test/resources/broken-refs/broken-internal-refs-3.0.x.yml)
- [broken-refs/broken-internal-refs-3.1.x.yml](/test/resources/broken-refs/broken-internal-refs-3.1.x.yml)
- [broken-refs/no-ref-siblings-3.0.x.yml](/test/resources/broken-refs/no-ref-siblings-3.0.x.yml)
- [broken-refs/no-ref-siblings-3.1.x.yml](/test/resources/broken-refs/no-ref-siblings-3.1.x.yml)

**Undefined Required Properties Tests**:
- [undefined-required-properties/undefined-required-properties-3.0.x.yml](/test/resources/undefined-required-properties/undefined-required-properties-3.0.x.yml)
- [undefined-required-properties/undefined-required-properties-3.1.x.yml](/test/resources/undefined-required-properties/undefined-required-properties-3.1.x.yml)
- [undefined-required-properties/device-interface-scope-3.0.x.yml](/test/resources/undefined-required-properties/device-interface-scope-3.0.x.yml)
- [undefined-required-properties/smart-switch-integration-3.0.x.yml](/test/resources/undefined-required-properties/smart-switch-integration-3.0.x.yml)
- [undefined-required-properties/security-policies-complete-3.0.x.yml](/test/resources/undefined-required-properties/security-policies-complete-3.0.x.yml)
- [undefined-required-properties/reports-summary-complete-3.0.x.yml](/test/resources/undefined-required-properties/reports-summary-complete-3.0.x.yml)
- [undefined-required-properties/comprehensive-test-3.0.x.yml](/test/resources/undefined-required-properties/comprehensive-test-3.0.x.yml)
- [undefined-required-properties/valid-schema-3.0.x.yml](/test/resources/undefined-required-properties/valid-schema-3.0.x.yml)

## OpenAPI Version Differences

### OpenAPI 3.0.x

- `$ref` **SHOULD** be the only property at its level per specification
- Having sibling properties is **discouraged** but parsers may allow it
- Both rules **work** and catch issues effectively

### OpenAPI 3.1.x

- `$ref` **CAN** have sibling properties 
- Structure is **VALID** per specification
- Both rules are **ESSENTIAL** to catch nested broken refs and undefined properties

## Usage

### Testing the Solution

```bash
# Test broken references on OpenAPI 3.0.3
spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.0.x.yml

# Test broken references on OpenAPI 3.1.0
spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.1.x.yml

# Test undefined required properties
spectral lint -r validation.js test/resources/undefined-required-properties/undefined-required-properties-3.0.x.yml

# Run unit tests
npm test -- functions/validateRefSiblings.spec.js
npm test -- functions/validateRequiredProperties.spec.js

# Run integration tests
npm test -- test/integration/broken-internal-refs.test.js
npm test -- test/integration/undefined-required-properties.test.js
npm test -- test/integration/undefined-properties-yaml.test.js

# Run all tests
npm test
```

### Expected Behavior

**For files with broken nested refs**:
```bash
$ spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.0.x.yml

/path/to/broken-internal-refs-3.0.x.yml
   22:23  error  broken-internal-refs  internal references should exist; broken reference '#/components/schemas/PolicySeverity'  components.schemas.TestSchema.properties.commonAnomaly
  ✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

**For files with undefined required properties**:
```bash
$ spectral lint -r validation.js test/resources/undefined-required-properties/undefined-required-properties-3.0.x.yml

/path/to/undefined-required-properties-3.0.x.yml
  17:22  error  undefined-required-properties  required properties must be defined; 'severities' is not defined  components.schemas.ThresholdAnomaly
  ✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

**For files with valid refs and properties**:
```bash
$ spectral lint -r validation.js test/resources/broken-refs/no-ref-siblings-3.0.x.yml
No results with a severity of 'error' found!
```

## Real-World Impact

### Issues Found in `manage.yaml` openAPI spec that was shared along with [issue #48](https://wwwin-github.cisco.com/DevNet/api-insights-support/issues/48)

The rules successfully detect real-world issues:

```bash
$ spectral lint -r validation.js manage.yaml

/path/to/manage.yaml
 11980:22  error  undefined-required-properties  required properties must be defined; 'severities' is not defined                                                                        components.schemas.ThresholdAnomaly
 11988:23  error  broken-internal-refs           internal references should point to existing components; broken reference '#/components/schemas/PolicySeverity'  components.schemas.ThresholdAnomaly.properties.commonAnomaly
 14023:26  error  undefined-required-properties  required properties must be defined; 'switchid' is not defined                                                                          components.schemas.deviceInterfaceScope
 16736:34  error  undefined-required-properties  required properties must be defined; 'switchName' is not defined                                                                        components.schemas.smartSwitchIntegrationIdData
 22814:25  error  undefined-required-properties  required properties must be defined; 'protocol' is not defined                                                                          components.schemas.basePermitDenyEntry
 25083:23  error  undefined-required-properties  required properties must be defined; 'type' is not defined                                                                              components.schemas.summaryProperties

✖ 6 problems (6 errors, 0 warnings, 0 infos, 0 hints)
```

## Technical Details

### The `resolved: false` Flag

This is the **critical** configuration that makes the broken references solution work:

```javascript
'resolved': false  // Run on unresolved document
```

- **Without this**: Rule runs on resolved document, nested refs are already merged and hidden
- **With this**: Rule runs on raw parsed YAML, before Spectral processes any `$ref` references

