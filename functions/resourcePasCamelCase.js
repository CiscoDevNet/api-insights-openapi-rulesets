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

import isPascalOrCamelCase from '../util/isPascalOrCamelCase';
/**
 * @typedef {object} Options
 * @property {string} [substring] Specify to check the last string ('last') in the path
 * or the path leading ('leading') to the last string. Anything else will check the whole path.
 */

// Regex for grabbing nodes in a path
const nodeRegex = /(?!\/)([^/]+)/g;
// Regex for splitting the entire path by the last forward slash
// Considers strings without a slash to be the last node
const pathRegex = /^((.*)\/)?(.*)$/;

/**
 * Checks a resource name for lowerCamelCase
 * @param {string} input The string to lint
 * @param {Options} opts String requirements given by the linter ruleset
 */
export default function (input, opts) {
  // Edge case check
  if (typeof input !== 'string' || !input.length || input === '/') {
    return;
  }

  // Remove all variables in curly brackets from resource path
  const cleanedResource = input.replace(/{.*}/g, '');

  const { substring = '' } = opts ?? { };
  // split the string using the last forward slash as the divider
  const [,, leading = '', last = ''] = cleanedResource?.match(pathRegex) || [];
  let str;

  if (substring === 'last') {
    str = last;
  } else if (substring === 'leading') {
    str = leading;
  } else {
    str = cleanedResource;
  }


  const result = [];
  let node;

  while ((node = nodeRegex.exec(str)) !== null) {
    // nodeRegex will iterately execute on the string and track its last index
    const [, _node] = node;

    if (_node && !isPascalOrCamelCase(_node)) {
      // user will have to iteratively resolve issues in the same string
      result.push({
        message: `${ _node } must be PasCamelCase`,
      });
    }
  }

  // If resource does not pass pasCamelCase test, return with error message
  if (result?.length) {
    return result;
  }
}

