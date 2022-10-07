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

import anyOfEnum from './anyOfEnum.js';
describe('anyOfEnum', () => {
  test('check for unallowed value', () => {
    const testAllowed = [
      'hello',
      'goodbye',
    ];
    const testValue = [
      'hello',
      'goodbye',
      'goodnight',
    ];

    expect(anyOfEnum(testValue, { values: testAllowed })).toEqual([
      {
        message: 'The following values must be removed: goodnight.',
      },
    ]);
  });
  test('check that passes', () => {
    const testAllowed = [
      'one',
      'two',
      'three',
    ];
    const testValue = [
      'three',
      'one',
      'TWO',
      'one',
      'one',
    ];

    expect(anyOfEnum(testValue, { values: testAllowed })).toBeUndefined();
  });
  test('should pass if not all enum values are matched', () => {
    const testAllowed = [
      'one',
      'two',
      'three',
    ];
    const testValue = ['three'];

    expect(anyOfEnum(testValue, { values: testAllowed })).toBeUndefined();
  });
  test('should ignore undefined and null input', () => {
    const testAllowed = [
      'one',
      'two',
      'three',
    ];

    expect(anyOfEnum(undefined, { values: testAllowed })).toBeUndefined();
    expect(anyOfEnum(null, { values: testAllowed })).toBeUndefined();
  });
});
