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

import hasErrorMessage from './hasErrorMessage.js';
const OAS3displayName = 'OpenAPI 3.0';
const OAS3FormatSet = new Set([{ displayName: OAS3displayName }]);

const context = {
  documentInventory: {
    document: {
      formats: OAS3FormatSet,
    },
  },
  rule: {
    formats: OAS3FormatSet,
  },
};

describe('hasErrorMessage', () => {
  test('should find error message', () => {
    const res = hasErrorMessage({
      content: {
        'application/json': {
          schema: {
            properties: {
              message: {
                type: 'string',
              },
            },
          },
        },
      },
    }, null, null, context);

    expect(res).toBeUndefined();
  });
  test('should find error message when key is an array', () => {
    const res = hasErrorMessage({
      content: {
        'application/json': {
          schema: {
            properties: {
              messAGes: {
                type: 'array',
                items: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    }, null, null, context);

    expect(res).toBeUndefined();
  });
  test('should find error message when key is nested', () => {
    const res = hasErrorMessage({
      content: {
        'application/json': {
          schema: {
            properties: {
              ERROR: {
                type: 'object',
                properties: {
                  messagE: {
                    type: 'string',
                  },
                },
              },
            },
          },
        },
      },
    }, null, null, context);

    expect(res).toBeUndefined();
  });
  test('should find error message when key is nested and an array', () => {
    const res = hasErrorMessage({
      content: {
        'application/json': {
          schema: {
            properties: {
              ERROR: {
                type: 'object',
                properties: {
                  meSSages: {
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
    }, null, null, context);

    expect(res).toBeUndefined();
  });
  test('should detect lack of error message', () => {
    const res = hasErrorMessage({
      content: {
        'application/json': {
          schema: {
            properties: {},
          },
        },
      },
    }, null, null, context);

    expect(res).toEqual([
      {
        message: 'Error representations include a useful human-readable message.',
      },
    ]);
  });
});
