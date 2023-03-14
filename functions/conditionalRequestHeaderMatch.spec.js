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
const conditionalRequestHeaderMatch = require('./conditionalRequestHeaderMatch');

describe('conditionalRequestHeaderMatch', () => {
  const targetVal = {
    parameters: [
      {
        in: 'header',
        name: 'If-Match',
        schema: {
          type: 'string',
        },
      },
    ],
    responses: {
      200: {
        description: 'OK',
        headers: {
          Etag: {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  };

  test('should pass when header have all the values', () => {
    const res = conditionalRequestHeaderMatch(targetVal);

    expect(res).toBeUndefined();
  });

  test('should fail if pair response header is missing for conditional request', () => {
    const targetVal = {
      parameters: [
        {
          in: 'header',
          name: 'If-Match',
          schema: {
            type: 'string',
          },
        },
      ],
      responses: {
        200: {
          description: 'OK',
          headers: {
            'Last-Modified': {
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
    };
    const res = conditionalRequestHeaderMatch(targetVal);

    expect(res).toEqual([
      {
        message:
          'Etag is missing in response header for conditional request header If-Match: (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)',
      },
    ]);
  });
});
