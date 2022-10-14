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
const approvedWords = [
  '_id',
  'x-cisco-data-classification',
];

/**
 * Check a passed field for proper CamelCase or PascalCase, allowing the exception of the word '_id'
 * and parameters that are in the header (e.g. 'Content-Type')
 *
 * @param {string|object} input The word to check if a string. Optionally a parameter object.
 * @param {string} [input.name] If an object, the word to check
 * @param {string} [input.in] If an object, the location where the parameter comes from
 */
export default function (input, _opts, context) {
  const { path: paths } = context;
  const value = typeof input === 'string' ? input : input.name;
  const header = input.in === 'header';

  if (approvedWords.includes(value) || header) {
    return undefined;
  }

  // The path given in the CLI is different than the given/target
  // Thus, the value shown in the CLI will be different if not returned here
  const rootPath = paths;
  let path = rootPath.join('.');

  if (typeof input !== 'string') {
    path += '.name';
  }

  return (isPascalOrCamelCase(value))
    ? undefined
    : [{ message: `${ value } (${ path })` }];
}
