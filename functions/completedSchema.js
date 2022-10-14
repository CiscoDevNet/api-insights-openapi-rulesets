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
 * Checks targetVal array has at least one of the opts.patterns
 * @param {string} targetVal The string to lint
 * @param {Options} opts String requirements given by the linter ruleset
 */
module.exports = function (targetVal) {
  if (typeof targetVal !== 'object') {
    return;
  }

  if (targetVal.type && targetVal.type !== 'object') {
    return;
  }

  if (targetVal.properties && Object.keys(targetVal.properties).length > 0) {
    return;
  }

  // TODO: test
  if (targetVal.anyOf || targetVal.allOf || targetVal.oneOf || targetVal.not) {
    return;
  }

  return [
    {
      message: 'properties missing for object schema',
    },
  ];
};
