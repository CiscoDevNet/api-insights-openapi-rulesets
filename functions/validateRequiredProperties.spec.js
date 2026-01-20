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
  describe, expect, it,
} from '@jest/globals';
import validateRequiredProperties from './validateRequiredProperties.js';

describe('validateRequiredProperties', () => {
  const mockContext = {
    document: {
      data: {}
    }
  };

  describe('basic validation', () => {
    it('should return empty array when input is null', () => {
      const result = validateRequiredProperties(null, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when input is not an object', () => {
      const result = validateRequiredProperties('string', {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when schema is not an object type', () => {
      const input = {
        type: 'string',
        required: ['name'],
        properties: {
          name: { type: 'string' }
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when no required array', () => {
      const input = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when no properties object', () => {
      const input = {
        type: 'object',
        required: ['name']
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when all required properties are defined', () => {
      const input = {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' },
          email: { type: 'string' }
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([]);
    });
  });

  describe('missing required properties', () => {
    it('should detect single missing required property', () => {
      const input = {
        type: 'object',
        required: ['name', 'email'],
        properties: {
          name: { type: 'string' }
          // email is missing
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "'email' is not defined"
        }
      ]);
    });

    it('should detect multiple missing required properties', () => {
      const input = {
        type: 'object',
        required: ['name', 'email', 'age'],
        properties: {
          name: { type: 'string' }
          // email and age are missing
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        message: "'email' is not defined"
      });
      expect(result).toContainEqual({
          message: "'age' is not defined"
      });
    });

    it('should detect missing required property when some are defined', () => {
      const input = {
        type: 'object',
        required: ['name', 'email', 'age'],
        properties: {
          name: { type: 'string' },
          age: { type: 'number' }
          // email is missing
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "'email' is not defined"
        }
      ]);
    });

    it('should detect missing required property with complex schema', () => {
      const input = {
        type: 'object',
        required: ['commonAnomaly', 'severities'],
        properties: {
          commonAnomaly: {
            $ref: '#/components/schemas/CommonAnomalyPolicy'
          }
          // severities is missing
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "'severities' is not defined"
        }
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle empty required array', () => {
      const input = {
        type: 'object',
        required: [],
        properties: {
          name: { type: 'string' }
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should handle empty properties object', () => {
      const input = {
        type: 'object',
        required: ['name'],
        properties: {}
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "'name' is not defined"
        }
      ]);
    });

    it('should handle required array with duplicate properties', () => {
      const input = {
        type: 'object',
        required: ['name', 'name', 'email'],
        properties: {
          name: { type: 'string' }
          // email is missing
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "'email' is not defined"
        }
      ]);
    });

    it('should handle schema without explicit type (defaults to object)', () => {
      const input = {
        required: ['name'],
        properties: {
          // name is missing
        }
      };
      const result = validateRequiredProperties(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "'name' is not defined"
        }
      ]);
    });
  });
});
