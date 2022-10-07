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

import allOfEnum from './allOfEnum.js';
describe('allOfEnum', () => {
  test('should flag enums that do not have all values', () => {
    const testRequired = [
      'hello',
      'goodbye',
    ];
    const testHave = [
      'hello',
      'what is up',
    ];

    expect(allOfEnum(testHave, { values: testRequired })).toEqual([
      {
        message: 'The following values are missing from the enum: goodbye.',
      },
    ]);
  });
  test('should pass enums that match and then some', () => {
    const testRequired = [
      'hello',
      'goodbye',
    ];
    const testHave = [
      'HELLO',
      'goodbye',
      'good morning',
      'good evening',
    ];

    expect(allOfEnum(testHave, { values: testRequired })).toBeUndefined();
  });
  test('should ignore undefined and null input', () => {
    const testRequired = [
      'one',
      'two',
      'three',
    ];

    expect(allOfEnum(undefined, { values: testRequired })).toBeUndefined();
    expect(allOfEnum(null, { values: testRequired })).toBeUndefined();
  });
});
