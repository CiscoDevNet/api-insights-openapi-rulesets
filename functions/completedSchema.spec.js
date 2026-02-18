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

import completedSchema from './completedSchema';

describe('completedSchema', () => {

  const targetVal = {
    'required': [
      'id',
      'name',
    ],
    'properties': {
      'id': {
        'type': 'integer',
        'format': 'int64',
      },
      'name': {
        'type': 'string',
      },
      'tag': {
        'type': 'string',
      },
    },
  };

  test('should pass when has non empty schemas', () => {
    const res = completedSchema(targetVal);

    expect(res).toBeUndefined();
  });

  test('should pass when schema type is not object', () => {
    const targetVal = {
      'type': 'string',
    };
    const res = completedSchema(targetVal);

    expect(res).toBeUndefined();
  });

  test('should fail when schema properties is empty', () => {
    const targetVal = {
      'required': [
        'id',
        'name',
      ],
      'properties': {
      },
    };
    const res = completedSchema(targetVal);

    expect(res).toEqual([
      {
        message: 'properties missing for object schema',
      },
    ]);
  });

  test('should fail when schema properties is missing', () => {
    const targetVal = {
      'required': [
        'id',
        'name',
      ],
    };
    const res = completedSchema(targetVal);

    expect(res).toEqual([
      {
        message: 'properties missing for object schema',
      },
    ]);
  });

  describe('additionalProperties: false (Issue #57)', () => {
    test('should pass for empty object with additionalProperties: false', () => {
      const schema = {
        type: 'object',
        additionalProperties: false,
      };
      expect(completedSchema(schema)).toBeUndefined();
    });

    test('should pass for empty object with additionalProperties: false and description', () => {
      const schema = {
        type: 'object',
        description: 'Response for successful operation',
        additionalProperties: false,
      };
      expect(completedSchema(schema)).toBeUndefined();
    });

    test('should pass for empty object with additionalProperties: false and example', () => {
      const schema = {
        type: 'object',
        example: {},
        additionalProperties: false,
      };
      expect(completedSchema(schema)).toBeUndefined();
    });

    test('should pass for v1AddOrUpdatePolicyConnectionsResponse pattern', () => {
      const schema = {
        type: 'object',
        example: {},
        description: 'Response for a successful association/disassociation of connections to a policy',
        additionalProperties: false,
      };
      expect(completedSchema(schema)).toBeUndefined();
    });

    test('should fail for empty object without additionalProperties: false', () => {
      const schema = {
        type: 'object',
      };
      expect(completedSchema(schema)).toEqual([
        { message: 'properties missing for object schema' },
      ]);
    });

    test('should fail for empty object with additionalProperties: true', () => {
      const schema = {
        type: 'object',
        additionalProperties: true,
      };
      expect(completedSchema(schema)).toEqual([
        { message: 'properties missing for object schema' },
      ]);
    });

    test('should fail for empty object with additionalProperties as schema', () => {
      const schema = {
        type: 'object',
        additionalProperties: { type: 'string' },
      };
      expect(completedSchema(schema)).toEqual([
        { message: 'properties missing for object schema' },
      ]);
    });

    test('should pass for object with empty properties and additionalProperties: false', () => {
      const schema = {
        type: 'object',
        properties: {},
        additionalProperties: false,
      };
      expect(completedSchema(schema)).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    test('should pass for non-object input', () => {
      expect(completedSchema('string')).toBeUndefined();
      expect(completedSchema(123)).toBeUndefined();
      expect(completedSchema(null)).toBeUndefined();
    });
  });
});
