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

import multiVersion from './multiVersion.js';

describe('multiVersion', () => {

  const opts = {};

  const targetVal = {
    'servers': [
      {
        'url': 'http://api.example1.com/v1.2',
      },
      {
        'url': 'http://api.example3.com/v1.2',
      },
      {
        'url': 'http://api.example2.com/v1.2',
      },
    ],
    'paths': {
      '/test1': {
        'get': {
          'description': 'Get some test data1.',
          'operationId': 'getTestData1',
        },
      },
      '/test2': {
        'get': {
          'description': 'Get some test data1.',
          'operationId': 'getTestData2',
        },
      },
    },
  };

  test('should pass when only one version in servers', () => {
    const res = multiVersion(targetVal, opts);

    expect(res).toEqual([]);
  });

  test('should fail when server version does not exist', () => {
    const targetVal = {
      'servers': [
        {
          'url': 'http://api.example1.com/v1.2',
        },
        {
          'url': 'http://api.example3.com',
        },
        {
          'url': 'http://api.example2.com/v1.2',
        },
      ],
      'paths': {
        '/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData1',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData2',
          },
        },
      },
    };
    const res = multiVersion(targetVal, { 'check': 'server-url-missing' });

    expect(res).toEqual([
      {
        message: 'no version in server urls or basePath.',
        path: [
          'servers',
          1,
        ],
      },
    ]);
  });

  test('should fail when servers have multi versions', () => {
    const targetVal = {
      'servers': [
        {
          'url': 'http://api.example1.com/v1.2',
        },
        {
          'url': 'http://api.example3.com/v1.3',
        },
        {
          'url': 'http://api.example2.com/v1.2',
        },
      ],
      'paths': {
        '/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData1',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData2',
          },
        },
      },
    };
    const res = multiVersion(targetVal, {});

    expect(res).toEqual([
      {
        message: 'multi versions in servers.',
        path: [
          'servers',
        ],
      },
    ]);
  });

  test('should fail when both servers and paths have versions', () => {
    const targetVal = {
      'servers': [
        {
          'url': 'http://api.example1.com/v1.2',
        },
        {
          'url': 'http://api.example3.com/v1.2',
        },
        {
          'url': 'http://api.example2.com/v1.2',
        },
      ],
      'paths': {
        'v1.2/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData1',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData2',
          },
        },
      },
    };
    const res = multiVersion(targetVal, {});

    expect(res).toEqual([
      {
        message: 'path should not have version while server object has one.',
        path: [
          'paths',
          'v1.2/test1',
        ],
      },
    ]);
  });

  test('should fail when paths versions are not consistent', () => {
    const targetVal = {
      'servers': [
        {
          'url': 'http://api.example1.com',
        },
        {
          'url': 'http://api.example3.com',
        },
        {
          'url': 'http://api.example2.com',
        },
      ],
      'paths': {
        '/v1.2/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData1',
          },
        },
        '/v1.3/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData2',
          },
        },
      },
    };
    const res = multiVersion(targetVal, {});

    expect(res).toEqual([
      {
        message: 'multi versions in paths.',
        path: [
          'paths',
          '/v1.3/test2',
        ],
      },
    ]);
  });

  test('should fail when server version does not exist for oas2', () => {
    const targetVal = {
      'swagger': '2.0',
      'basePath': '/app',
      'paths': {
        '/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData1',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData2',
          },
        },
      },
    };
    const res = multiVersion(targetVal, { 'check': 'server-url-missing' });

    expect(res).toEqual([
      {
        message: 'no version in server urls or basePath.',
        path: [
          'basePath',
        ],
      },
    ]);
  });

  test('should fail when both servers and paths have versions for oas2', () => {
    const targetVal = {
      'swagger': '2.0',
      'basePath': '/v1/app',
      'paths': {
        'v1.2/test1': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData1',
          },
        },
        '/test2': {
          'get': {
            'description': 'Get some test data1.',
            'operationId': 'getTestData2',
          },
        },
      },
    };
    const res = multiVersion(targetVal, {});

    expect(res).toEqual([
      {
        message: 'path should not have version while server object has one.',
        path: [
          'paths',
          'v1.2/test1',
        ],
      },
    ]);
  });


});
