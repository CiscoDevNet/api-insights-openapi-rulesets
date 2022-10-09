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

import reasonPhrases from './reasonPhrases.js';
describe('headOperationsMatchHeadersWithGet', () => {
  test('should fail if no match, case sensitive', () => {
    expect(reasonPhrases('ok', null, {
      path: [
        'paths',
        '/path',
        'get',
        'responses',
        '200',
        'description',
      ],
    })).toBeTruthy();
  });
  test('should fail if no match', () => {
    expect(reasonPhrases('wrong phrase', null, {
      path: [
        'paths',
        '/path',
        'get',
        'responses',
        '200',
        'description',
      ],
    })).toBeTruthy();
  });
  test('should determine if a given description is valid for a code - case insensitive', () => {
    expect(reasonPhrases('Ok', { caseSensitive: false }, {
      path: [
        'paths',
        '/path',
        'get',
        'responses',
        '200',
        'description',
      ],
    })).toBeUndefined();
  });
  test('should check for a ', () => {
    expect(reasonPhrases('OK', null, {
      path: [
        'paths',
        '/path',
        'get',
        'responses',
        '200',
        'description',
      ],
    })).toBeUndefined();
  });
});
