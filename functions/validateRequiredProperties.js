/**
 * Copyright 2022 Cisco Systems, Inc. and its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE/2.0
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
 * Validates that all properties listed in the required array are defined in the properties object
 * @param {Object} input - The schema object to validate
 * @param {Object} options - Function options
 * @param {Object} context - Spectral context with document and path info
 * @returns {Array} Array of validation results
 */
export default function validateRequiredProperties(input, options, context) {
  if (!input || typeof input !== 'object') {
    return [];
  }

  // Only validate object schemas
  if (input.type && input.type !== 'object') {
    return [];
  }

  // Skip if no required array or properties object
  if (!input.required || !Array.isArray(input.required)) {
    return [];
  }

  if (!input.properties || typeof input.properties !== 'object') {
    return [];
  }

  const results = [];
  const definedProperties = Object.keys(input.properties);

  // Check each required property
  for (const requiredProp of input.required) {
    if (!definedProperties.includes(requiredProp)) {
      results.push({
        message: `'${requiredProp}' is not defined`,
      });
    }
  }

  return results;
}
