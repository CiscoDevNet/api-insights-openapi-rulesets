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

import correctResponseRange from './correctResponseRange.js';
describe('correctResponseRange', () => {
  const opts = {
    validRanges: [
      { 'start': 200, 'stop': 299 },
      { 'start': 300, 'stop': 399 },
      { 'start': 400, 'stop': 499 },
      { 'start': 500, 'stop': 599 },
    ],
    rangeString: '2xx/3xx/4xx/5xx',
  };

  test('should allow 2xx, 3xx, 4xx, 5xx, and default status codes', () => {
    const res = correctResponseRange({
      200: {},
      250: {},
      299: {},
      300: {},
      301: {},
      350: {},
      399: {},
      400: {},
      450: {},
      499: {},
      500: {},
      550: {},
      599: {},
      default: {},
    }, opts);

    expect(res).toBeUndefined();
  });
  test('should not allow wacky status codes', () => {
    const res = correctResponseRange({
      99: {},
      100: {},
      204: {},
      401: {},
      782: {},
    }, opts);

    expect(res).toEqual([
      {
        message: 'Status Code(s) [99,100,782] must be in the 2xx/3xx/4xx/5xx ranges',
      },
    ]);
  });
});
