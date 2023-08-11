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

import hasRecommendedStatusCodes from './hasRecommendedStatusCodes.js';
const commonCodes = [
  '200',
  '201',
  '202',
  '204',
  '301',
  '302',
  '303',
  '400',
  '401',
  '403',
  '404',
  '405',
  '406',
  '409',
  '410',
  '415',
  '422',
  '429',
  '500',
  '501',
  '503',
  '504',
  'default',
];
const disallowedCodes = {
  delete: [
    '201',
    '202',
  ],
  get: [
    '201',
    '202',
    '204',
  ],
  patch: [
    '201',
    '202',
  ],
  post: ['204'],
  put: ['201'],
};

describe('hasRecommendedStatusCodes', () => {
  test('should pass with GET valid status codes', () => {
    const getAllowedCodes = commonCodes.filter((el) => {
      return disallowedCodes.get.indexOf(el) < 0;
    });

    for (const res of getAllowedCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'get' })).toBeUndefined();
    }
  });
  test('should fail for GET 201, 202, and 204', () => {
    const badCodes = [
      201,
      202,
      204,
    ];

    for (const res of badCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'get' })).toEqual([
        {
          message: `${ res } is not an acceptable response code for GET. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
        },
      ]);
    }
  });
  test('should fail for GET with wacky codes', () => {
    const badCodes = [
      210,
      388,
      417,
      511,
    ];

    for (const res of badCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'get' })).toEqual([
        {
          message: `${ res } is not an acceptable response code for GET. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
        },
      ]);
    }
  });
  test('should pass with POST valid status codes', () => {
    const postAllowedCodes = commonCodes.filter((el) => {
      return disallowedCodes.post.indexOf(el) < 0;
    });

    for (const res of postAllowedCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'post' })).toBeUndefined();
    }
  });
  test('should fail for POST 204', () => {
    const badCodes = [204];

    for (const res of badCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'post' })).toEqual([
        {
          message: `${ res } is not an acceptable response code for POST. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
        },
      ]);
    }
  });
  test('should pass with PUT valid status codes', () => {
    const putAllowedCodes = commonCodes.filter((el) => {
      return disallowedCodes.put.indexOf(el) < 0;
    });

    for (const res of putAllowedCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'put' })).toBeUndefined();
    }
  });
  test('should fail for PUT 201', () => {
    const badCodes = [201];

    for (const res of badCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'put' })).toEqual([
        {
          message: `${ res } is not an acceptable response code for PUT. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
        },
      ]);
    }
  });
  test('should pass with PATCH valid status codes', () => {
    const patchAllowedCodes = commonCodes.filter((el) => {
      return disallowedCodes.patch.indexOf(el) < 0;
    });

    for (const res of patchAllowedCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'patch' })).toBeUndefined();
    }
  });
  test('should fail for PATCH 201, 202', () => {
    const badCodes = [
      201,
      202,
    ];

    for (const res of badCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'patch' })).toEqual([
        {
          message: `${ res } is not an acceptable response code for PATCH. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
        },
      ]);
    }
  });
  test('should pass with DELETE valid status codes', () => {
    const deleteAllowedCodes = commonCodes.filter((el) => {
      return disallowedCodes.delete.indexOf(el) < 0;
    });

    for (const res of deleteAllowedCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'delete' })).toBeUndefined();
    }
  });
  test('should fail for DELETE 201, 202', () => {
    const badCodes = [
      201,
      202,
    ];

    for (const res of badCodes) {
      expect(hasRecommendedStatusCodes(res, { method: 'delete' })).toEqual([
        {
          message: `${ res } is not an acceptable response code for DELETE. My API responds with recommended HTTP status codes in the 2xx/3xx/4xx/5xx ranges.`,
        },
      ]);
    }
  });
});
