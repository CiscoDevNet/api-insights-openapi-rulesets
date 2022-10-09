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
 * Utility function to check if targetVal include all the values in the opts. value can be in a.b... format.
 * @param {*} targetVal The enum to check
 * @param {*} opts The options for the utility function
 * @returns Any linting errors found
 */
module.exports = function (targetVal, opts) {
  if (typeof targetVal !== 'object') {
    return;
  }

  const values = opts?.values ?? [];

  if (values.length === 0) {
    return [
      {
        message: 'opts.values is required to be an non-empty array',
      },
    ];
  }

  const missing = [];

  for (const value of values) {
    // if (targetVal[value]) {
    if (match(targetVal, value)) {
      continue;
    }

    missing.push(value);
  }

  if (missing.length > 0) {
    return [
      {
        message: `The following values must be incuded: ${ missing.toString() }.`,
      },
    ];
  }
};

// This is to suport a.b
function match(targetVal, val) {
  if (!targetVal) {
    return false;
  }

  const es = val.split('.');

  for (const e of es) {
    targetVal = targetVal[e];
    if (!targetVal) {
      return false;
    }
  }

  return true;
}
