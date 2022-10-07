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

import checkPluralRepresentationFields from './checkPluralRepresentationFields.js';
const testPath = [
  'this',
  'is',
  'a',
  'test',
];

describe('checkPluralRepresentationFields', () => {
  test('should flag an array without a plural field name', () => {
    const spec = {
      type: 'object',
      properties: {
        account: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
      },
    };

    expect(checkPluralRepresentationFields(spec, {}, { path: testPath })).toEqual([
      {
        message: 'account should be plural.',
        path: [
          ...testPath,
          'properties',
          'account',
        ],
      },
    ]);
  });
  test('should not flag an array with a plural field name', () => {
    const spec = {
      type: 'object',
      properties: {
        accounts: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
      },
    };

    expect(checkPluralRepresentationFields(spec, {}, { path: testPath })).toBeUndefined();
  });
  test('should flag multiple arrays without a plural field name', () => {
    const spec = {
      type: 'object',
      properties: {
        balance: {
          type: 'array',
          items: {
            type: 'number',
          },
        },
        id: {
          type: 'number',
        },
        name: {
          type: 'string',
        },
        details: {
          type: 'object',
          properties: {
            device: {
              type: 'array',
              items: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    address: {
                      type: 'array',
                      items: {
                        type: 'string',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    expect(checkPluralRepresentationFields(spec, {}, { path: testPath })).toEqual([
      {
        message: 'balance should be plural.',
        path: [
          ...testPath,
          'properties',
          'balance',
        ],
      },
      {
        message: 'device should be plural.',
        path: [
          ...testPath,
          'properties',
          'details',
          'properties',
          'device',
        ],
      },
      {
        message: 'address should be plural.',
        path: [
          ...testPath,
          'properties',
          'details',
          'properties',
          'device',
          'items',
          'items',
          'properties',
          'address',
        ],
      },
    ]);
  });
});
