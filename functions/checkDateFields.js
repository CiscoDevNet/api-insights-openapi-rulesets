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

import traverseObjectResponse from '../util/traverseObjectResponse.js';
'use strict';
/**
 * Common field names that should be type 'date-time'.
 */
const commonDateFieldNames = [
  'created',
  'createdAt',
  'timestamp',
  'updated',
  'updatedAt',
];
/**
 * Words that, if matched when a camelCase field name is split, should
 * be type 'date-time'.
 */
const dateWords = [
  'date',
  'dates',
];

/**
 * Checks if a field name is likely a date field.
 * @param {String} fieldName The field name to check.
 * @returns True if likely a date field, false if not.
 */
function isDateFieldName(fieldName) {
  // Search through common names thrhough commonFieldNames constant.
  if (commonDateFieldNames.find((commonFieldName) => commonFieldName.toLowerCase() === fieldName.toLowerCase())) {
    return true;
  }

  // Now search for 'date' by splitting a camelCase name
  // and checking it in the dateWords constant.
  if (fieldName.split(/(?=[A-Z])/).find((fieldNameWord) => dateWords.find((dateConstWord) => dateConstWord.toLowerCase() === fieldNameWord.toLowerCase()))) {
    return true;
  }

  return false;
}

export default function (input, opts, context) {
  const { path } = context;
  const messages = [];
  const prettyPath = path;

  traverseObjectResponse(input, (spec, name, path) => {
    const { format, type, items } = spec;
    const { format: itemFormat, type: itemType } = items ?? {};

    if (type === 'array' && itemType !== 'object' && itemType !== 'array' && isDateFieldName(name) && (itemType !== 'string' || itemFormat !== 'date-time')) {
      messages.push({
        message: `Field ${ name }'s items should be type "string" with a format of "date-time".`,
        path: [
          ...prettyPath,
          ...path,
          'items',
        ],
      });
    } else if (type !== 'array' && type !== 'object' && isDateFieldName(name) && (type !== 'string' || format !== 'date-time')) {
      messages.push({
        message: `Field ${ name } should be type "string" with a format of "date-time".`,
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

