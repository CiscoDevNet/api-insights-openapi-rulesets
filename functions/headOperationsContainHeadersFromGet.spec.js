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

import headOperationsContainHeadersFromGet from './headOperationsContainHeadersFromGet.js';
const testPath = [
  'this',
  'is',
  'a',
  'test',
];

describe('headOperationsContainHeadersFromGet', () => {
  test('should handle endpoints without a GET or HEAD response', () => {
    const noHead = { get: {} };
    const noGet = { head: {} };
    const nothing = {};

    expect(headOperationsContainHeadersFromGet(noHead, {}, { path: testPath })).toBeUndefined();
    expect(headOperationsContainHeadersFromGet(noGet, {}, { path: testPath })).toBeUndefined();
    expect(headOperationsContainHeadersFromGet(nothing, {}, { path: testPath })).toBeUndefined();
  });
  test('should handle endpoints without responses', () => {
    const noHeadResponse = { get: { responses: {} }, head: {} };
    const noGetResponse = { get: {}, head: { responses: {} } };

    expect(headOperationsContainHeadersFromGet(noHeadResponse, {}, { path: testPath })).toBeUndefined();
    expect(headOperationsContainHeadersFromGet(noGetResponse, {}, { path: testPath })).toBeUndefined();
  });
  test('should pass headers that are the same', () => {
    // Should still work even though CustomHeader is out of order.
    const spec = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
            headers: {
              Authorization: {
                schema: {
                  type: 'string',
                },
              },
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            headers: {
              Authorization: {
                schema: {
                  type: 'string',
                },
              },
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    };

    expect(headOperationsContainHeadersFromGet(spec, {}, { path: testPath })).toBeUndefined();
  });
  test('should fail if headers are missing from HEAD but should pass if headers are missing from GET', () => {
    const getMissingHeaders = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            headers: {
              Authorization: {
                schema: {
                  type: 'string',
                },
              },
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    };
    const headMissingHeaders = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
            headers: {
              Authorization: {
                schema: {
                  type: 'string',
                },
              },
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            headers: {
              'Some-Unrelated-Header': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    };

    expect(headOperationsContainHeadersFromGet(getMissingHeaders, {}, { path: testPath })).toBeUndefined();
    expect(headOperationsContainHeadersFromGet(headMissingHeaders, {}, { path: testPath })).toEqual([
      {
        message: 'The following headers are missing from the HEAD operation for response code 200: Authorization,CustomHeader',
        path: [
          ...testPath,
          'head',
          'responses',
          '200',
          'headers',
        ],
      },
    ]);
  });
  test('should pass if both GET and HEAD are missing headers', () => {
    const spec = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {},
        },
      },
    };

    expect(headOperationsContainHeadersFromGet(spec, {}, { path: testPath })).toBeUndefined();
  });
  test('should pass if head is missing a response code', () => {
    const spec = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
            headers: {
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          204: {
            headers: {
              AnotherCustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            headers: {
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    };

    expect(headOperationsContainHeadersFromGet(spec, {}, { path: testPath })).toBeUndefined();
  });
  test('should check more than one response code', () => {
    const spec = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
            headers: {
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          204: {
            headers: {
              AnotherCustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            headers: {
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          204: {},
        },
      },
    };

    expect(headOperationsContainHeadersFromGet(spec, {}, { path: testPath })).toEqual([
      {
        message: 'The HEAD operation for response code 204 is missing a "headers" definition',
        path: [
          ...testPath,
          'head',
          'responses',
          '204',
        ],
      },
    ]);
  });
  test('should check all response codes even after an error has already been found', () => {
    const spec = {
      get: {
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/testGet',
                },
              },
            },
            headers: {
              CustomHeader: {
                schema: {
                  type: 'string',
                },
              },
              'X-Another-CustomHeader': {
                schema: {
                  type: 'string',
                },
              },
              'X-Page-Header': {
                schema: {
                  type: 'string',
                },
              },
              'X-Another-Page-Header': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          204: {
            headers: {
              AnotherCustomHeader: {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
      head: {
        responses: {
          200: {
            headers: {
              'X-Another-CustomHeader': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
          204: {},
        },
      },
    };

    expect(headOperationsContainHeadersFromGet(spec, {}, { path: testPath })).toEqual([
      {
        message: 'The following headers are missing from the HEAD operation for response code 200: CustomHeader,X-Page-Header,X-Another-Page-Header',
        path: [
          ...testPath,
          'head',
          'responses',
          '200',
          'headers',
        ],
      },
      {
        message: 'The HEAD operation for response code 204 is missing a "headers" definition',
        path: [
          ...testPath,
          'head',
          'responses',
          '204',
        ],
      },
    ]);
  });
});
