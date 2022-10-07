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

import checkForSortAndOrderParameters from './checkForSortAndOrderParameters.js';
describe('checkForSortAndOrderParameters', () => {
  test('should flag a sort parameter with no order parameter', () => {
    const testParams = [
      {
        in: 'query',
        name: 'sort',
      },
    ];

    expect(checkForSortAndOrderParameters(testParams)).toEqual([
      {
        message: 'Consider changing the "sort" param to an "order" param.',
      },
    ]);
  });
  test('should not flag a sort parameter with an order parameter', () => {
    const testParams = [
      {
        in: 'query',
        name: 'sort',
      },
      {
        in: 'query',
        name: 'order',
      },
    ];

    expect(checkForSortAndOrderParameters(testParams)).toBeUndefined();
  });
  test('should not flag an empty input', () => {
    expect(checkForSortAndOrderParameters([])).toBeUndefined();
    expect(checkForSortAndOrderParameters(undefined)).toBeUndefined();
  });
});
