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
 * Default maximum length used if none is specified in the linter rules.
 */
const defaultMaxLength = 25;
/**
 * Regex to use to match variables in the resource name.
 */
const idRegex = /{[^/]*}/g;
/**
 * Regex to retrieve last string in the resource name
 */
const last = /(?!.*\/)(.*)/;

export default function (input, opts) {
  if (typeof input === 'string') {
    const maxLength = opts?.maxLength ?? defaultMaxLength;
    // get rid of variables in the path and split by forward slash
    const matches = input.match(last);

    // the regex should match such that it's length 2
    if (matches?.length > 0) {
      const [, resourceName] = matches;
      // get the match and replace it with an empty if it's a variable
      const { length } = resourceName.replace(idRegex, '');
      const { cutOffLength } = opts ?? {};

      if (length > maxLength && (!cutOffLength || length <= cutOffLength)) {
        return [
          {
            message: `"${ resourceName }" is longer than allowed maximum of ${ maxLength }`,
          },
        ];
      }
    }
  }
}
