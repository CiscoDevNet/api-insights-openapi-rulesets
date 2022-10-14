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

import verifyResourceLength from './verifyResourceLength.js';
describe('verifyResourceLength', () => {
  test('should pass a string length below the maxiumum', () => {
    expect.assertions(1);
    expect(verifyResourceLength('test', { maxLength: 25 })).toBeUndefined();
  });
  test('should pass a string equal in length to the maximum', () => {
    expect.assertions(1);
    expect(verifyResourceLength('this is a test!', { maxLength: 15 })).toBeUndefined();
  });
  test('should catch a string greater in length than the maximum', () => {
    expect.assertions(1);
    expect(verifyResourceLength('this is another test!', { maxLength: 15 })).toEqual([
      {
        message: '"this is another test!" is longer than allowed maximum of 15',
      },
    ]);
  });
  test('should pass on a string that is greater than the cutoff length', () => {
    expect.assertions(1);
    expect(verifyResourceLength('this is a another test!', { maxLength: 15, cutOffLength: 20 })).toBeUndefined();
  });
});
