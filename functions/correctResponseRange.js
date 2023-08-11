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

/**
 * Determines if status code is between a min/max range, inclusive
 * @param {number} num status code to test
 * @param {number} min min range
 * @param {number} max max range
 * @returns {boolean}
 */
function between(num, min, max) {
  if (num >= min && num <= max) {
    return true;
  }

  return false;
}

export default function (input, opts) {
  const errStatusCodes = [];
  const { validRanges } = opts;
  const { rangeString } = opts;

  if (!input) {
    return;
  }

  // For each status code in resource response
  Object.keys(input).forEach((statusCode) => {
    // Test if status code is in specified ranges or is 'default'
    for (const range of validRanges) {
      if (statusCode === 'default' || between(parseInt(statusCode), range.start, range.stop)) {
        return;
      }
    }

    errStatusCodes.push(statusCode);
  });
  // If any errors were recorded, return error
  if (errStatusCodes.length) {
    return [
      {
        message: `Status Code(s) [${ errStatusCodes.toString() }] must be in the ${ rangeString } ranges`,
      },
    ];
  }
}
