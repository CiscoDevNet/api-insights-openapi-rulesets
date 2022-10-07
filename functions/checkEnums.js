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

'use strict';
/**
 * String comparison helper that has a case sensitivity flag.
 * @param {string} str1 First string to compare.
 * @param {string} str2 Second string to compare.
 * @param {boolean} caseSensitive True for case sensitive, false for not case sensitive.
 * @returns True if matching, false if not matching.
 */
function compare(str1, str2, caseSensitive) {
  if (caseSensitive) {
    return str1 === str2;
  }

  return str1.toUpperCase() === str2.toUpperCase();
}

export default function (input, opts) {
  if (!input || !Array.isArray(input)) {
    return;
  }

  const shouldMatch = opts.shouldMatch ?? true;
  const caseSensitive = opts.caseSensitive ?? false;
  const enums = opts.enums ?? [];
  const copiedVal = [...input];
  const sortedinput = copiedVal.sort().join(',');

  // Loop through each valid enum in the enum array given in opts.
  for (const arr of enums) {
    // Check if the enum from the list of enums matches with the enum from the spec.
    if (compare(arr.sort().join(','), sortedinput, caseSensitive)) {
      // If it should not match, then throw a linting error.
      if (!shouldMatch) {
        return [
          {
            message: 'Given matches target enums.',
          },
        ];
      }

      // If it should match, then exit without throwing any linting errors.
      return;
    }
  }

  // If the loop finishes and we should have found a match, throw a linting error.
  if (shouldMatch) {
    return [
      {
        message: 'Given does not match target enums.',
      },
    ];
  }
}
