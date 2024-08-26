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

/**
 * Main function to ensure unique error descriptions across API operations.
 * @param {Object} targetVal - The object containing API operations.
 * @returns {Array} - An array of messages indicating where duplicates are found, if any.
 */
export default function ensureUniqueErrorDescriptions(targetVal) {
  if (!isObject(targetVal)) {
    return [];
  }

  const duplicateErrorDescriptions = Object.entries(targetVal).flatMap(([path, methods]) => Object.entries(methods).flatMap(([method, { responses }]) => checkForDuplicateDescriptions(responses, path, method),
  ),
  );

  return duplicateErrorDescriptions;
}

/**
 * Finds and formats duplicate error descriptions within the given responses.
 * @param {Object} responses - Responses object for a given operation.
 * @param {string} path - The operation's path in the API documentation.
 * @param {string} method - The HTTP method for the operation.
 * @returns {Array} - An array of objects detailing where duplicates are found.
 */
function checkForDuplicateDescriptions(responses = {}, path, method) {
  // Create a map of descriptions to status codes.
  const descriptionMap = mapDescriptionsToStatusCodes(responses);

  // Filter out unique descriptions, leaving only duplicates, and format the results.
  return Object.entries(descriptionMap)
    .filter(([, codes]) => codes.length > 1)
    .map(([description, codes]) => formatDuplicateMessage(description, codes, path, method));
}

/**
 * Maps descriptions to their respective status codes, focusing on error codes.
 * @param {Object} responses - Responses object for a given operation.
 * @returns {Object} - A map of descriptions to arrays of status codes.
 */
function mapDescriptionsToStatusCodes(responses) {
  return Object.entries(responses)
    .filter(([statusCode]) => /^[45]/.test(statusCode)) // Focus on error status codes (4xx, 5xx).
    .reduce((acc, [statusCode, { description }]) => {
      acc[description] = acc[description] || [];
      acc[description].push(statusCode);

      return acc;
    }, {});
}

/**
 * Formats a message about duplicate descriptions.
 * @param {string} description - The duplicated description.
 * @param {Array} codes - The status codes sharing this description.
 * @param {string} path - The path of the operation in the API documentation.
 * @param {string} method - The HTTP method for the operation.
 * @returns {Object} - An object containing the formatted message and the path to the duplication.
 */
function formatDuplicateMessage(description, codes, path, method) {
  return {
    message: `Error Description "${ description }" should be unique within each API operation but is duplicated for these codes: ${ codes.join(', ') }`,
    path: ['paths', path, method],
  };
}
