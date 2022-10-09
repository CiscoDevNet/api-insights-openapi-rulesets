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

import reasonPhrases from '../util/reasonPhrases.js';
export default function (input, opts, context) {
  const { path } = context;
  const { caseSensitive = true } = opts ?? {};
  // The target path should look something like
  // ['paths', '/path', 'get', 'responses', '200', 'description']
  // the code will be in the 2nd to last index
  const [code = ''] = path.slice(-2);
  const description = reasonPhrases[code];

  // if there is no description for the code, ignore.
  if (!description) { return; }

  if ((caseSensitive && input !== description)
        || (!caseSensitive && input.toLowerCase() !== description.toLowerCase())) {
    return [
      {
        message: `Reason phrase "${ input }" needs to match "${ description }"`,
      },
    ];
  }
}
