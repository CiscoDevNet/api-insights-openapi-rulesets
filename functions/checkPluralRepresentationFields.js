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

import pluralize from 'pluralize';
import traverseObjectResponse from '../util/traverseObjectResponse.js';
const { isPlural } = pluralize;

export default function (input, opts, context) {
  const { path } = context;
  const prettyPath = path;
  const messages = [];

  traverseObjectResponse(input, (spec, name, path) => {
    if (spec.type === 'array' && !isPlural(name)) {
      messages.push({
        message: `${ name } should be plural.`,
        path: [
          ...prettyPath,
          ...path,
        ],
      });
    }
  });
  if (messages.length > 0) {
    return messages;
  }
}
