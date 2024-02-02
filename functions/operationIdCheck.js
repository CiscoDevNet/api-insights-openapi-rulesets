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
 * Checks operationId is uniq and use the verbNoun format
 * @param {string} targetVal The string to lint
 */
// module.exports = function (targetVal) {
export default function (targetVal) {
  if (!isObject(targetVal) || !isObject(targetVal.paths)) {
    return;
  }

  const results = [];
  const { paths } = targetVal;
  const seenIds = [];

  for (const { path, operation } of (0, getAllOperations)(paths)) {
    const pathValue = paths[path];

    if (!isObject(pathValue)) {
      continue;
    }

    const operationValue = pathValue[operation];

    if (!isObject(operationValue) || !('operationId' in operationValue)) {
      results.push({
        message: 'operationId is missing.',
        path: ['paths', path, operation, 'operationId'],
      });

      continue;
    }

    const { operationId } = operationValue;

    if (seenIds.includes(operationId)) {
      results.push({
        message: 'operationId must be unique.',
        path: ['paths', path, operation, 'operationId'],
      });
    } else {
      seenIds.push(operationId);
    }
  }

  return results;
}

const validOperationKeys = ['get', 'head', 'post', 'put', 'patch', 'delete', 'options', 'trace'];

function* getAllOperations(paths) {
  if (!isObject(paths)) {
    return;
  }

  const item = {
    path: '',
    operation: '',
    value: null,
  };

  for (const path of Object.keys(paths)) {
    const operations = paths[path];

    if (!isObject(operations)) {
      continue;
    }

    item.path = path;
    for (const operation of Object.keys(operations)) {
      if (!isObject(operations[operation]) || !validOperationKeys.includes(operation)) {
        continue;
      }

      item.operation = operation;
      item.value = operations[operation];
      yield item;
    }
  }
}


function split(s) {
  const arr = s.split(/[.\-_]|([A-Z][a-z]+)/).filter((e) => e);
  const first = arr[0] || '';
  const second = arr.slice(1).join('');

  return [first, second];
}
