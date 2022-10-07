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

import checkPutSuccess from './checkPutSuccess.js';
const errorMsg = 'PUT operations return either \'200 OK\' with full representation or \'204 No Content\'.';

describe('checkPutSuccess', () => {
  test('should check for 200 OK and representation in an OAS3 document', () => {
    const res = checkPutSuccess({
      requestBody: {
        content: {
          'application/json': {
            type: 'dummy',
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              type: 'dummy',
            },
          },
        },
      },
    });

    expect(res).toBeUndefined();
  });
  test('should check for 200 OK and representation in an OAS2 document', () => {
    const res = checkPutSuccess({
      parameters: [
        {
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            type: 'dummy',
          },
        },
      ],
      responses: {
        200: {
          description: 'OK',
          schema: {
            type: 'dummy',
          },
        },
      },
    });

    expect(res).toBeUndefined();
  });
  test('should check for 204 OK', () => {
    const res = checkPutSuccess({
      responses: {
        204: {
          description: 'No Content',
        },
      },
    });

    expect(res).toBeUndefined();
  });
  test('should detect more than one 2xx code', () => {
    const res = checkPutSuccess({
      responses: {
        204: {
          description: 'No Content',
        },
        200: {
          description: 'OK',
        },
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should check for 200 description', () => {
    const res = checkPutSuccess({
      responses: {
        200: {},
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should check for 204 description', () => {
    const res = checkPutSuccess({
      responses: {
        204: {},
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should detect 204 schema property', () => {
    const res = checkPutSuccess({
      responses: {
        204: {
          description: 'No Content',
          schema: {},
        },
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should check for 200 request body', () => {
    const res = checkPutSuccess({
      responses: {
        200: {
          description: 'OK',
          content: {
            'application/json': {
              type: 'dummy',
            },
          },
        },
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should check for 200 response body in an OAS3 document', () => {
    const res = checkPutSuccess({
      requestBody: {
        content: {
          'application/json': {
            type: 'dummy',
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
        },
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should check for 200 response body in an OAS2 document', () => {
    const res = checkPutSuccess({
      parameters: [
        {
          name: 'body',
          in: 'body',
          required: true,
          schema: {
            type: 'dummy',
          },
        },
      ],
      responses: {
        200: {
          description: 'OK',
        },
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
  test('should allow for only one 2xx response', () => {
    const res = checkPutSuccess({
      requestBody: {
        content: {
          'application/json': {
            type: 'dummy',
          },
        },
      },
      responses: {
        200: {
          description: 'OK',
        },
        201: {},
      },
    });

    expect(res).toEqual([
      {
        message: errorMsg,
      },
    ]);
  });
});
