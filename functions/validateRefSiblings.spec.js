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
import validateRefSiblings from './validateRefSiblings.js';

describe('validateRefSiblings', () => {
  const mockContext = {
    document: {
      data: {
        components: {
          schemas: {
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' }
              }
            },
            Organization: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' }
              }
            },
            CommonPolicy: {
              type: 'object',
              properties: {
                details: { type: 'string' },
                isActive: { type: 'boolean' }
              }
            }
          }
        }
      }
    }
  };

  describe('basic validation', () => {
    it('should return empty array when input has no $ref', () => {
      const input = {
        type: 'object',
        properties: {
          name: { type: 'string' }
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when input is null', () => {
      const result = validateRefSiblings(null, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when input is not an object', () => {
      const result = validateRefSiblings('string', {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when $ref has no sibling properties', () => {
      const input = {
        $ref: '#/components/schemas/User'
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when context is missing', () => {
      const input = {
        $ref: '#/components/schemas/User',
        description: 'A user'
      };
      const result = validateRefSiblings(input, {}, null);
      expect(result).toEqual([]);
    });

    it('should return empty array when context.document.data is missing', () => {
      const input = {
        $ref: '#/components/schemas/User',
        description: 'A user'
      };
      const result = validateRefSiblings(input, {}, { document: {} });
      expect(result).toEqual([]);
    });
  });

  describe('valid nested references in siblings', () => {
    it('should return empty array when nested $ref in sibling is valid', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        additionalProp: {
          $ref: '#/components/schemas/User'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when nested $ref in array items is valid', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        items: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/User'
          }
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when multiple valid nested $refs exist', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        users: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/User'
          }
        },
        organization: {
          $ref: '#/components/schemas/Organization'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should return empty array when deeply nested valid $ref exists', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        properties: {
          data: {
            properties: {
              user: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });
  });

  describe('broken nested references in siblings', () => {
    it('should detect broken $ref in direct sibling property', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        additionalProp: {
          $ref: '#/components/schemas/NonExistent'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/NonExistent'"
        }
      ]);
    });

    it('should detect broken $ref in array items sibling', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        severities: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/PolicySeverity'
          }
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/PolicySeverity'"
        }
      ]);
    });

    it('should detect multiple broken $refs in siblings', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        prop1: {
          $ref: '#/components/schemas/NonExistent1'
        },
        prop2: {
          $ref: '#/components/schemas/NonExistent2'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        message: "broken reference '#/components/schemas/NonExistent1'"
      });
      expect(result).toContainEqual({
        message: "broken reference '#/components/schemas/NonExistent2'"
      });
    });

    it('should detect deeply nested broken $ref', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        properties: {
          nested: {
            deep: {
              value: {
                $ref: '#/components/schemas/DeepNonExistent'
              }
            }
          }
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/DeepNonExistent'"
        }
      ]);
    });

    it('should detect broken $ref in array of objects', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        arrayProp: [
          {
            $ref: '#/components/schemas/NonExistent'
          }
        ]
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/NonExistent'"
        }
      ]);
    });
  });

  describe('mixed valid and broken references', () => {
    it('should only report broken references when mix exists', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        validProp: {
          $ref: '#/components/schemas/User'
        },
        brokenProp: {
          $ref: '#/components/schemas/NonExistent'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/NonExistent'"
        }
      ]);
    });

    it('should validate all references in complex nested structure', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        users: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/User'  // valid
          }
        },
        policies: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/Policy'  // broken
          }
        },
        organization: {
          $ref: '#/components/schemas/Organization'  // valid
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/Policy'"
        }
      ]);
    });
  });

  describe('external references', () => {
    it('should ignore external HTTP references', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        externalProp: {
          $ref: 'http://example.com/schema.json'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should ignore external HTTPS references', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        externalProp: {
          $ref: 'https://example.com/schema.json'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should ignore relative file references', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        externalProp: {
          $ref: './schemas/user.json'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should validate internal refs but ignore external refs', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        internalBroken: {
          $ref: '#/components/schemas/NonExistent'
        },
        externalRef: {
          $ref: 'http://example.com/schema.json'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toHaveLength(1);
      expect(result).toEqual([
        {
          message: "broken reference '#/components/schemas/NonExistent'"
        }
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle sibling with null value', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        nullProp: null
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should handle sibling with primitive value', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        stringProp: 'some value',
        numberProp: 42
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should handle empty object sibling', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        emptyProp: {}
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should handle empty array sibling', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        emptyArray: []
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([]);
    });

    it('should handle $ref pointing to non-existent path segment', () => {
      const input = {
        $ref: '#/components/schemas/CommonPolicy',
        brokenPath: {
          $ref: '#/nonexistent/path/schema'
        }
      };
      const result = validateRefSiblings(input, {}, mockContext);
      expect(result).toEqual([
        {
          message: "broken reference '#/nonexistent/path/schema'"
        }
      ]);
    });
  });
});

