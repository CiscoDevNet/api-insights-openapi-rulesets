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

const REGEXP_PATTERN = /^\/(.+)\/([a-z]*)$/;

function regExp(pattern) {
  const splitRegex = REGEXP_PATTERN.exec(pattern);

  if (splitRegex !== null) {
    return new RegExp(splitRegex[1], splitRegex[2]);
  }

  // without slashes like [a-b]+
  return new RegExp(pattern);
}

/**
 * Checks targetVal array has at least one of the opts.patterns
 * @param {string} targetVal The string to lint
 * @param {Options} opts String requirements given by the linter ruleset
 */
module.exports = function (targetVal, opts) {
  if (typeof targetVal !== 'object') {
    return;
  }

  const patterns = opts?.patterns ?? [];

  if (patterns.length === 0) {
    return [
      {
        message: 'opts.patterns is required to be an non-empty array',
      },
    ];
  }

  for (const pattern of patterns) {
    const reg = regExp(pattern);

    for (const field in targetVal) {
      if (reg.test(field)) {
        return;
      }
    }
  }

  return [
    {
      message: `none of ${ patterns } are matched`,
    },
  ];
};
