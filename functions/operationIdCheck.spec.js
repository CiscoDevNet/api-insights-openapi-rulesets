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

import operationIdCheck from './operationIdCheck.js';

describe('operationIdCheck', () => {

  const opts = {};

  const targetVal = {
    'paths': {
      '/test1': {
        'get': {
          'description': 'Get some test data1.',
          'operationId': 'getTestData',
        },
      },
      '/test2': {
        'get': {
          'description': 'Get some test data1.',
          'operationId': 'getData',
        },
      },
      '/test3': {
        'get': {
          'description': 'Get some test data1.',
          'operationId': 'get-data',
        },
      },
    },
  };

  test('should pass if operationId uniq', () => {
    const res = operationIdCheck(targetVal, opts);

    expect(res).toEqual([]);
  });

  test('should fail when operationId missing', () => {
    const targetVal = {
      'paths': {
        '/test1': {
          'get': {
            'description': 'Get some test data1.',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'pet',
          },
        },
      },
    };
    const res = operationIdCheck(targetVal);

    expect(res).toEqual([
      {
        message: 'operationId is missing.',
        path: [
          'paths',
          '/test1',
          'get',
          'operationId',
        ],
      },
    ]);
  });

  test('should fail when operationId not uniq', () => {
    const targetVal = {
      'paths': {
        '/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getData',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getData',
          },
        },
      },
    };
    const res = operationIdCheck(targetVal);

    expect(res).toEqual([
      {
        message: 'operationId must be unique.',
        path: [
          'paths',
          '/test2',
          'get',
          'operationId',
        ],
      },
    ]);
  });

});
