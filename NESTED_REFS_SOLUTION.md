# Nested Broken References Detection - Solution Summary

## Problem Statement

The Spectral validator `validation.js` was not catching the broken `$ref` references like `#/components/schemas/PolicySeverity` in the [spec file](/test/resources/broken-refs/broken-internal-refs-3.0.x.yml), specifically when they appeared in nested structures within sibling properties of another `$ref`.
The original issue #48 reported is [here](https://wwwin-github.cisco.com/DevNet/api-insights-support/issues/48). 

## Root Cause Analysis

### The Issue

In OpenAPI 3.1.x, the specification allows `$ref` to have sibling properties at the same level while OAS 3.0.x doesn't allow this:

```yaml
commonAnomaly:
  $ref: '#/components/schemas/CommonAnomalyPolicy'
  severities:  # Sibling property - valid in OAS 3.1.x but invalid in OAS 3.0.x and are genrally ignored by toolings
    type: array
    items:
      $ref: '#/components/schemas/PolicySeverity'  # Nested ref
```
The broken refrence `#/components/schemas/PolicySeverity` was not being caught in both OAS 3.0.x and 3.1.x specs. Ideally, a broken reference should be reported as `invalid-ref` error as part of `oas3-schema ruleset`.

### Why It Wasn't Caught

1. **In OAS 3.0.x**: With respect to the parent commonAnomaly, Spectral simply ignored sibling property `severities` of `#ref`. Hence, validation never reached to `#/components/schemas/PolicySeverity`.
2. **In OAS 3.1.x**: Spectral resolves `$ref` references during document parsing. When a `$ref` has sibling properties, Spectral merges them during resolution. By the time inbuilt `invalid-ref` validation rule runs, the nested and broken `$ref` has been absorbed into the resolved schema structure and hence is not caught as an error.

## Solution Implemented

### 1. Added a rule `no-$ref-siblings` in validation.js 
It warns that `$ref must not be placed next to any other properties` in case of OAS 3.0.x specs.

### 2. Created `validateRefSiblings.js` Preprocessor

**File**: [functions/validateRefSiblings.js](/functions/validateRefSiblings.js)

**Purpose**: Catches broken `$ref` references that are nested within sibling properties of another `$ref`.

**How It Works**:
1. Runs on the **unresolved document** (before Spectral processes `$ref` references)
2. Identifies objects that have both a `$ref` and sibling properties
3. Recursively searches sibling properties for nested `$ref` references
4. Validates each nested `$ref` against the document data
5. Reports broken references with detailed path information

**Key Features**:
- Works with `resolved: false` flag to run before reference resolution
- Handles deeply nested structures
- Supports arrays and complex object hierarchies
- Ignores external references (HTTP/HTTPS/file paths)
- Only validates internal references (starting with `#/`)

### 3. Updated `validation.js` Ruleset

**File**: [validation.js](/validation.js) 

**Changes**:
- Added import for `validateRefSiblings`
- Created new rule: `broken-refs-in-siblings`
- Configured with `resolved: false` to run on unresolved document
- Uses `$..' JSONPath to match all objects
- Error severity for broken references


### 4. Comprehensive Test Suites

#### Unit Tests: `validateRefSiblings.spec.js`

**File**: [functions/validateRefSiblings.spec.js](/functions/validateRefSiblings.spec.js)

**Coverage**:
- Basic validation (null inputs, missing $ref, no siblings)
- Valid nested references (should pass)
- Broken nested references (should fail)
- Multiple broken references
- Deeply nested structures
- External references (should be ignored)
- Edge cases (null values, primitives, empty objects)

#### Integration Tests: `validation-nested-refs.spec.js`

**File**: [test/validation-nested-refs.spec.js](/test/validation-nested-refs.spec.js)

**Coverage**:
- OpenAPI 3.0.3 scenarios
- OpenAPI 3.1.0 scenarios (where $ref+siblings is valid per spec)
- Real-world ThresholdAnomaly/PolicySeverity scenario
- Multiple broken references
- Mixed valid and broken references
- External references handling
- Edge cases and complex nested structures


#### Test Resource Files

**Directory**: [test/resources/broken-refs/](/test/resources/broken-refs/)

Test files for different scenarios:

1. [broken-internal-refs-3.0.x.yml](/test/resources/broken-refs/broken-internal-refs-3.0.x.yml)
   - OpenAPI 3.0.3 spec with broken `PolicySeverity` reference
   - Has `$ref` with sibling properties (technically invalid in 3.0.3)
   - Used to verify preprocessor catches broken nested refs

2. [broken-internal-refs-3.1.x.yml](/test/resources/broken-refs/broken-internal-refs-3.1.x.yml)
   - OpenAPI 3.1.0 spec with broken `PolicySeverity` reference
   - Has `$ref` with sibling properties (valid in 3.1.0)
   - Used to verify preprocessor catches broken nested refs

3. [no-ref-siblings-3.0.x.yml](/test/resources/broken-refs/no-ref-siblings-3.0.x.yml)
   - OpenAPI 3.0.3 spec with valid `PolicySeverity` reference
   - Has `$ref` with sibling properties
   - Used to verify no false positives when ref is valid

4. [no-ref-siblings-3.1.x.yml](/test/resources/broken-refs/no-ref-siblings-3.1.x.yml)
   - OpenAPI 3.1.0 spec with valid `PolicySeverity` reference
   - Has `$ref` with sibling properties
   - Used to verify no false positives when ref is valid


## OpenAPI Version Differences

### OpenAPI 3.0.x

- `$ref` **SHOULD** be the only property at its level per specification
- Having sibling properties is **discouraged** but parsers may allow it
- Our preprocessor **works** and catches broken nested refs

### OpenAPI 3.1.x

- `$ref` **CAN** have sibling properties 
- Structure is **VALID** per specification
- Our preprocessor is **ESSENTIAL** to catch nested broken refs

## Usage

### Testing the Solution

```bash
# Test on OpenAPI 3.0.3 with broken refs
spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.0.x.yml

# Test on OpenAPI 3.1.0 with broken refs
spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.1.x.yml

# Run unit tests
npm test -- functions/validateRefSiblings.spec.js

# Run integration tests
npm test -- test/validation-nested-refs.spec.js
```

### Expected Behavior

**For files with broken nested refs**:
```bash
$ spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.0.x.yml

/path/to/broken-internal-refs-3.0.x.yml
  22:23    error  broken-refs-in-siblings  Broken reference in sibling property 'severities.items.$ref': #/components/schemas/PolicySeverity  components.schemas.TestSchema.properties.commonAnomaly
  24:22  warning  no-$ref-siblings         $ref must not be placed next to any other properties                                               components.schemas.TestSchema.properties.commonAnomaly.severities
  ✖ 2 problems (1 error, 1 warning, 0 infos, 0 hints)
```
```bash
$ spectral lint -r validation.js test/resources/broken-refs/broken-internal-refs-3.1.x.yml

/path/to/broken-internal-refs-3.1.x.yml
 22:23  error  broken-refs-in-siblings  Broken reference in sibling property 'severities.items.$ref': #/components/schemas/PolicySeverity
 ✖ 1 problem (1 error, 0 warnings, 0 infos, 0 hints)
```

**For files with valid refs**:
```bash
$ spectral lint -r validation.js test/resources/broken-refs/no-ref-siblings-3.0.x.yml
26:22  warning  no-$ref-siblings  $ref must not be placed next to any other properties  components.schemas.TestSchema.properties.commonAnomaly.severities
✖ 1 problem (0 error, 1 warnings, 0 infos, 0 hints)
```
```bash
$ spectral lint -r validation.js test/resources/broken-refs/no-ref-siblings-3.0.x.yml
No results with a severity of 'error' found!
```

## Technical Details

### The `resolved: false` Flag

This is the **critical** configuration that makes the solution work:

```javascript
'resolved': false  // Run on unresolved document
```

- **Without this**: Rule runs on resolved document, nested refs are already merged and hidden
- **With this**: Rule runs on raw parsed YAML, before Spectral processes any `$ref` references
