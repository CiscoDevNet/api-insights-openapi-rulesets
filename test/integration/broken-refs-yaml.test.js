/**
 * Copyright 2022 Cisco Systems, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

const { describe, expect, it } = require('@jest/globals');
const { Spectral } = require('@stoplight/spectral-core');
const { readFileSync } = require('fs');
const { join } = require('path');
const ruleset = require('../../validation.js').default;

describe('Integration Tests - broken-internal-refs YAML Files', () => {
  let spectral;

  beforeEach(() => {
    spectral = new Spectral();
    spectral.setRuleset(ruleset);
  });

  describe('broken-internal-refs rule', () => {
    it('should detect broken $ref in 3.0.x file', async () => {
      const yamlPath = join(__dirname, '../resources/broken-refs/broken-internal-refs-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasPolicySeverityError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/PolicySeverity'")
      );
      expect(hasPolicySeverityError).toBe(true);
    });

    it('should detect broken $ref in 3.1.x file', async () => {
      const yamlPath = join(__dirname, '../resources/broken-refs/broken-internal-refs-3.1.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      // Check that we have the expected error message
      const hasPolicySeverityError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/PolicySeverity'")
      );
      expect(hasPolicySeverityError).toBe(true);
    });

    it('should not detect broken $ref in no-ref-siblings 3.0.x file (all refs are valid)', async () => {
      const yamlPath = join(__dirname, '../resources/broken-refs/no-ref-siblings-3.0.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      // All references in this file are valid, so no broken-internal-refs errors should occur
      expect(brokenRefErrors).toHaveLength(0);
    });

    it('should not detect broken $ref in no-ref-siblings 3.1.x file (all refs are valid)', async () => {
      const yamlPath = join(__dirname, '../resources/broken-refs/no-ref-siblings-3.1.x.yml');
      const yamlContent = readFileSync(yamlPath, 'utf8');
      
      const results = await spectral.run(yamlContent);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      // All references in this file are valid, so no broken-internal-refs errors should occur
      expect(brokenRefErrors).toHaveLength(0);
    });

    it('should correctly identify valid vs broken references', async () => {
      // Test that the rule can distinguish between valid and broken references
      const document = {
        openapi: '3.0.3',
        info: {
          title: 'Test API',
          version: '1.0.0'
        },
        paths: {
          '/test': {
            get: {
              responses: {
                '200': {
                  description: 'OK',
                  content: {
                    'application/json': {
                      schema: {
                        $ref: '#/components/schemas/TestSchema'
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ValidSchema: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            TestSchema: {
              type: 'object',
              properties: {
                validRef: {
                  $ref: '#/components/schemas/ValidSchema', // This should be valid
                  description: 'Valid reference'
                },
                brokenRef: {
                  $ref: '#/components/schemas/ValidSchema',
                  nested: {
                    $ref: '#/components/schemas/NonExistentSchema' // This should be broken
                  }
                }
              }
            }
          }
        }
      };

      const results = await spectral.run(document);
      
      const brokenRefErrors = results.filter(
        result => result.code === 'broken-internal-refs'
      );
      
      // Should only detect the broken reference, not the valid one
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(1);
      
      const hasBrokenError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/NonExistentSchema'")
      );
      expect(hasBrokenError).toBe(true);
      
      // Should not have errors for the valid reference
      const hasValidError = brokenRefErrors.some(
        error => error.message.includes("broken reference '#/components/schemas/ValidSchema'")
      );
      expect(hasValidError).toBe(false);
    });
  });
});
