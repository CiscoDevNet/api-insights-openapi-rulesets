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

import { isObject } from '../util/funcUtils.js';

/**
 * Checks if there is only one version in server urls and paths.
 * @param {string} targetVal The string to lint
 * @param {object} opts checks to do
 */
export default function (targetVal) {
  if (!isObject(targetVal)) {
    return;
  }

  const results = [];

  for (const key in targetVal) {
    if (targetVal[key].enum && targetVal[key].default) {
      if (!targetVal[key].enum.includes(targetVal[key].default)) {
        results.push({
          message: 'default not in enum',
        });
      }
    }
  }

  return results;
}
