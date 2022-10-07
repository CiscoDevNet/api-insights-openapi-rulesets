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

import checkForSort from './checkForSort.js';
const options = { oasVersion: 2 };
const OAS2displayName = 'OpenAPI 2.0 (Swagger)';
const formatsSet = new Set([{ displayName: OAS2displayName }]);

const context = {
  rule: {
    formats: formatsSet,
  },
};

describe('checkForSort', () => {
  test('should flag a spec without a sort query parameter', () => {
    const spec = {
      responses: {
        '200': {
          schema: {
            type: 'array',
          },
        },
      },
    };

    expect(checkForSort(spec, options, context)).toEqual([
      {
        message: 'It is recommended to add a "sort" query parameter to sort this collection',
      },
    ]);
  });
  test('should flag a spec without a sort parameter that is not a query parameter', () => {
    const spec = {
      parameters: [
        {
          in: 'cookie',
          name: 'sort',
        },
      ],
      responses: {
        '200': {
          schema: {
            type: 'array',
          },
        },
      },
    };

    expect(checkForSort(spec, options, context)).toEqual([
      {
        message: 'It is recommended to add a "sort" query parameter to sort this collection',
      },
    ]);
  });
  test('should not flag a spec with a sort query parameter', () => {
    const spec = {
      parameters: [
        {
          in: 'query',
          name: 'sort',
        },
      ],
      responses: {
        '200': {
          schema: {
            type: 'array',
          },
        },
      },
    };

    expect(checkForSort(spec, options, context)).toBeUndefined();
  });
});
