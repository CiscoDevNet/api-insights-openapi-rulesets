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

const commonTopLevelKeys = [
  'error',
  'data',
  'result',
];

function normalizeObject(content) {
  // Checks if a nested key is valid by searching for type == object, allOf, or anyOf
  if (content.type === 'object') {
    return content?.properties;
  }

  if ('allOf' in content || 'anyOf' in content) {
    // properties key doesn't exist. Return xOf structure as a rough equivalent
    return content;
  }
}

export default (content) => {
  if (content && content instanceof Object) {
    // Check if this api uses a top level key; case insensitive
    for (const key of Object.keys(content)) {
      if (commonTopLevelKeys.includes(key.toLowerCase()) && normalizeObject(content[key])) {
        // Don't allow deeply nested keys
        // If there are multiple nested keys, return the first one found in
        // list above.
        // TODO: allow multiple nested top-level keys
        return normalizeObject(content[key]);
      }
    }
  }

  // Return content if not using nested keys so patterns such as this can be used:
  // if('foo' in getNestedKeyIfExists(schemaObj))
  return content;
};
