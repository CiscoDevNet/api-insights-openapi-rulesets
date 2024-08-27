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

import  checkConsistency  from '../util/checkCasingConsistency.js';

const isObject = (value) => value !== null && typeof value === 'object';

/**
 * Checks the targetVal object for consistent casing in operationIds across the document.
 * This function uses a common utility to check against various casing styles and
 * ensures that operationIds follow a consistent naming convention.
 * @param {object} targetVal The entire OpenAPI document.
 * @returns An array of messages if inconsistencies are found, or an empty array otherwise.
 */
export default function ensureOperationIdConsistency(targetVal) {
  if (!isObject(targetVal)) {
    return [];
  }

  const operationIds = Object.values(targetVal.paths || {})
    .flatMap((operations) => Object.values(operations))
    .filter((operation) => typeof operation.operationId === 'string')
    .map((operation) => operation.operationId);

  const inconsistencyResult = checkConsistency(operationIds);

  return inconsistencyResult
    ? [{ message: inconsistencyResult.message, path: [] }]
    : [];
}
