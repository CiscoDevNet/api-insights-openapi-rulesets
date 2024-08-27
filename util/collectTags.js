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
const isObject = (value) => value !== null && typeof value === 'object';

export default function collectTags(targetVal) {
  if (!isObject(targetVal)) {
    return new Map();
  }

  const globalTags = targetVal.tags
    ? targetVal.tags.map((tagObj, index) => [tagObj.name, ['tags', index.toString()]])
    : [];

  const operationTags = Object.entries(targetVal.paths || {}).flatMap(([pathKey, operations]) => Object.entries(operations).flatMap(([method, operation]) => operation.tags
        ? operation.tags.map((tag, index) => [tag, ['paths', pathKey, method, 'tags', index.toString()]])
        : [],
  ),
  );

  const allTags = [...globalTags, ...operationTags].reduce((acc, [tag, path]) => {
    if (!acc.has(tag)) {
      acc.set(tag, new Set());
    }

    acc.get(tag).add(path.join('.'));

    return acc;
  }, new Map());

  return allTags;
}

