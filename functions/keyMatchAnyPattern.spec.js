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

import keyMatchAnyPattern from './keyMatchAnyPattern';

describe('keyMatchAnyPattern', () => {

  const opts = {
    patterns: [
      '/^4\\d{2}$/',
      '/^5\\d{2}$/',
      '/^default$/',
    ],

  };

  const targetVal = {
    '400': 'desc',
    '500': 'desc',
  };

  test('should pass when all keys match pattern', () => {
    const res = keyMatchAnyPattern(targetVal, opts);

    expect(res).toBeUndefined();
  });

  test('should fail when opts.patterns does not exist', () => {
    const res = keyMatchAnyPattern({}, null);

    expect(res).toEqual([
      {
        message: 'opts.patterns is required to be an non-empty array',
      },
    ]);
  });

  test('should pass when one key does not match all patterns but others can', () => {
    const targetVal = {
      '400': 'desc',
      '600': 'desc',
    };
    const res = keyMatchAnyPattern(targetVal, opts);

    expect(res).toBeUndefined();
  });

  test('should fail when one key does not match all patterns', () => {
    const targetVal = {
      '200': 'desc',
      '300': 'desc',
    };
    const res = keyMatchAnyPattern(targetVal, opts);

    expect(res).toEqual([
      {
        message: 'none of /^4\\d{2}$/,/^5\\d{2}$/,/^default$/ are matched',
      },
    ]);
  });
});
