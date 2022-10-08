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
 * Internal helper function to recursively call a function on every
 * object property spec.
 * @param {Object} spec The spec to traverse.
 * @param {String} name The name of the current spec (if applicable).
 * @param {String[]} path The path of the current spec.
 * @param {TraversalCallback} cb The callback function to call.
 */
function _traverseObjectResponse(spec, name, path, cb) {
  if (spec) {
    if (name) {
      cb(spec, name, path);
    }

    switch (spec.type) {
      case 'object':
        // Only traverse if there are properties present.
        if (spec.properties) {
          for (const key of Object.keys(spec.properties)) {
            const newPath = [
              ...path,
              'properties',
              key,
            ];

            _traverseObjectResponse(spec.properties[key], key, newPath, cb);
          }
        }

        break;
      case 'array':
        // Only traverse if the items are type 'object' or 'array'.
        if (spec.items && (spec.items.type === 'object' || spec.items.type === 'array')) {
          const newPath = [
            ...path,
            'items',
          ];

          _traverseObjectResponse(spec.items, '', newPath, cb);
        }

        break;
      default:
        break;
    }
  }
}

export default function (spec, cb) {
  _traverseObjectResponse(spec, '', [], cb);
}
