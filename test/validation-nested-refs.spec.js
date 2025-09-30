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

import {
  describe, expect, it, beforeAll,
} from '@jest/globals';
import { Spectral } from '@stoplight/spectral-core';
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/with-loader';
import * as fs from 'fs';
import * as path from 'path';

// __dirname is provided by Jest in CommonJS mode
const rulesetPath = path.join(__dirname, '..', 'validation.js');

describe('validation.js - nested broken refs detection', () => {
  let spectral;
  let ruleset;

  beforeAll(async () => {
    spectral = new Spectral();
    ruleset = await bundleAndLoadRuleset(rulesetPath, { fs, fetch });
    spectral.setRuleset(ruleset);
  });

  describe('OpenAPI 3.0.3 - broken refs in standard locations', () => {
    it('should catch broken direct $ref', async () => {
      const spec = `
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/NonExistent'
components:
  schemas:
    User:
      type: object
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings' || 
        r.code === 'invalid-ref'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
    });

    it('should catch broken $ref in array items', async () => {
      const spec = `
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/NonExistent'
components:
  schemas:
    User:
      type: object
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings' || 
        r.code === 'invalid-ref'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
    });

    it('should catch broken refs in siblings even in 3.0.3 (our preprocessor works)', async () => {
      const spec = `
openapi: 3.0.3
info:
  title: Test API
  version: 1.0.0
paths: {}
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        commonAnomaly:
          $ref: '#/components/schemas/CommonPolicy'
          severities:
            type: array
            items:
              $ref: '#/components/schemas/PolicySeverity'
`;
      const results = await spectral.run(spec);
      
      // Our preprocessor should catch the broken ref even in 3.0.3
      // (even though the structure itself is technically invalid per spec)
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      expect(brokenRefErrors.length).toBeGreaterThan(0);
      expect(brokenRefErrors[0].message).toContain('PolicySeverity');
    });
  });

  describe('OpenAPI 3.1.0 - broken refs in sibling properties', () => {
    it('should catch broken $ref in sibling property', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        commonAnomaly:
          $ref: '#/components/schemas/CommonPolicy'
          severities:
            type: array
            items:
              $ref: '#/components/schemas/PolicySeverity'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
      expect(brokenRefErrors[0].message).toContain('PolicySeverity');
    });

    it('should catch multiple broken refs in sibling properties', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        property1:
          $ref: '#/components/schemas/CommonPolicy'
          nested1:
            $ref: '#/components/schemas/NonExistent1'
        property2:
          $ref: '#/components/schemas/CommonPolicy'
          nested2:
            $ref: '#/components/schemas/NonExistent2'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThanOrEqual(2);
    });

    it('should catch deeply nested broken ref in sibling', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        commonAnomaly:
          $ref: '#/components/schemas/CommonPolicy'
          properties:
            nested:
              properties:
                deep:
                  $ref: '#/components/schemas/DeepNonExistent'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
      expect(brokenRefErrors[0].message).toContain('DeepNonExistent');
    });

    it('should NOT report errors when nested refs in siblings are valid', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    User:
      type: object
    TestSchema:
      type: object
      properties:
        commonAnomaly:
          $ref: '#/components/schemas/CommonPolicy'
          users:
            type: array
            items:
              $ref: '#/components/schemas/User'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBe(0);
    });
  });

  describe('OpenAPI 3.1.0 - real-world scenario: ThresholdAnomaly', () => {
    it('should catch broken PolicySeverity ref in ThresholdAnomaly structure', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Anomaly API
  version: 1.0.0
paths:
  /anomalies:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThresholdAnomaly'
components:
  schemas:
    AnomalyTypeFormat:
      type: string
      enum: [basic, regex, threshold]
    ThresholdAnomalyType:
      type: string
      enum: [cpu, memory, disk]
    CommonAnomalyPolicy:
      type: object
      properties:
        details:
          type: string
        isActive:
          type: boolean
    ThresholdAnomaly:
      type: object
      properties:
        anomalyFormatType:
          $ref: '#/components/schemas/AnomalyTypeFormat'
        anomalyType:
          $ref: '#/components/schemas/ThresholdAnomalyType'
        commonAnomaly:
          $ref: '#/components/schemas/CommonAnomalyPolicy'
          severities:
            description: severity threshold values
            type: array
            items:
              $ref: '#/components/schemas/PolicySeverity'
      required:
        - anomalyFormatType
        - anomalyType
        - severities
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
      expect(brokenRefErrors.some(e => e.message.includes('PolicySeverity'))).toBe(true);
    });

    it('should NOT report error when PolicySeverity is defined', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Anomaly API
  version: 1.0.0
paths:
  /anomalies:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ThresholdAnomaly'
components:
  schemas:
    AnomalyTypeFormat:
      type: string
      enum: [basic, regex, threshold]
    ThresholdAnomalyType:
      type: string
      enum: [cpu, memory, disk]
    CommonAnomalyPolicy:
      type: object
      properties:
        details:
          type: string
        isActive:
          type: boolean
    PolicySeverity:
      type: string
      enum: [low, medium, high, critical]
    ThresholdAnomaly:
      type: object
      properties:
        anomalyFormatType:
          $ref: '#/components/schemas/AnomalyTypeFormat'
        anomalyType:
          $ref: '#/components/schemas/ThresholdAnomalyType'
        commonAnomaly:
          $ref: '#/components/schemas/CommonAnomalyPolicy'
          severities:
            description: severity threshold values
            type: array
            items:
              $ref: '#/components/schemas/PolicySeverity'
      required:
        - anomalyFormatType
        - anomalyType
        - severities
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBe(0);
    });
  });

  describe('OpenAPI 3.1.0 - external references', () => {
    it('should NOT report errors for external HTTP refs in siblings', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        commonAnomaly:
          $ref: '#/components/schemas/CommonPolicy'
          externalRef:
            $ref: 'http://example.com/schemas/external.json'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBe(0);
    });

    it('should catch internal broken refs but ignore external refs', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        commonAnomaly:
          $ref: '#/components/schemas/CommonPolicy'
          internalBroken:
            $ref: '#/components/schemas/NonExistent'
          externalRef:
            $ref: 'https://example.com/schemas/external.json'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
      expect(brokenRefErrors.some(e => e.message.includes('NonExistent'))).toBe(true);
      expect(brokenRefErrors.some(e => e.message.includes('example.com'))).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle $ref with non-object siblings', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TestSchema'
components:
  schemas:
    CommonPolicy:
      type: object
    TestSchema:
      type: object
      properties:
        prop:
          $ref: '#/components/schemas/CommonPolicy'
          description: "Some description"
          example: "example value"
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      // Should not error - no nested $refs
      expect(brokenRefErrors.length).toBe(0);
    });

    it('should handle multiple levels of $ref with siblings', async () => {
      const spec = `
openapi: 3.1.0
info:
  title: Test API
  version: 1.0.0
paths:
  /test:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Level1'
components:
  schemas:
    Base:
      type: object
    Level1:
      type: object
      properties:
        level1Prop:
          $ref: '#/components/schemas/Base'
          level2:
            $ref: '#/components/schemas/Base'
            level3:
              $ref: '#/components/schemas/NonExistent'
`;
      const results = await spectral.run(spec);
      const brokenRefErrors = results.filter(r => 
        r.code === 'broken-refs-in-siblings'
      );
      
      expect(brokenRefErrors.length).toBeGreaterThan(0);
      expect(brokenRefErrors.some(e => e.message.includes('NonExistent'))).toBe(true);
    });
  });
});

