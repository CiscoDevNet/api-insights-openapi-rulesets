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

/**
 * Preprocessor function that validates $ref references in sibling properties
 * This catches broken references that would be hidden during schema resolution
 * @param {Object} input - The object containing a $ref
 * @param {Object} options - Function options
 * @param {Object} context - Spectral context with document and path info
 * @returns {Array} Array of validation results
 */
export default function validateRefSiblings(input, options, context) {
  if (!input || typeof input !== 'object' || !input.$ref) {
    return [];
  }

  // Check if context has document data
  if (!context || !context.document || !context.document.data) {
    return [];
  }

  const results = [];
  
  // Get all sibling properties (excluding $ref itself)
  const siblingKeys = Object.keys(input).filter(key => key !== '$ref');
  
  if (siblingKeys.length === 0) {
    return [];
  }

  // Recursively find and validate all $ref references in sibling properties
  for (const key of siblingKeys) {
    const siblingValue = input[key];
    const nestedResults = findAndValidateRefs(
      siblingValue,
      context.document.data,
      `${key}`
    );
    results.push(...nestedResults);
  }

  return results;
}

/**
 * Recursively find all $ref values and validate them
 * @param {*} obj - Object to search
 * @param {Object} documentData - The full document data for validation
 * @param {string} pathPrefix - Path prefix for error messages
 * @returns {Array} Array of validation errors
 */
function findAndValidateRefs(obj, documentData, pathPrefix = '') {
  const results = [];

  if (!obj || typeof obj !== 'object') {
    return results;
  }

  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      const itemResults = findAndValidateRefs(
        item,
        documentData,
        `${pathPrefix}[${index}]`
      );
      results.push(...itemResults);
    });
  } else {
    for (const [key, value] of Object.entries(obj)) {
      const currentPath = pathPrefix ? `${pathPrefix}.${key}` : key;

      if (key === '$ref' && typeof value === 'string') {
        // Found a $ref - validate it
        const validationResult = validateRef(value, documentData, currentPath);
        if (validationResult) {
          results.push(validationResult);
        }
      } else if (typeof value === 'object') {
        // Recurse into nested objects
        const nestedResults = findAndValidateRefs(value, documentData, currentPath);
        results.push(...nestedResults);
      }
    }
  }

  return results;
}

/**
 * Validate a single $ref reference
 * @param {string} ref - The $ref value to validate
 * @param {Object} documentData - The full document data
 * @param {string} pathContext - Path context for error messages
 * @returns {Object|null} Validation error object or null if valid
 */
function validateRef(ref, documentData, pathContext) {
  // Only validate internal references (starting with #/)
  if (!ref || typeof ref !== 'string' || !ref.startsWith('#/')) {
    return null;
  }

  // Parse the reference path
  const path = ref.substring(2).split('/');

  // Try to resolve the reference
  let current = documentData;
  for (const segment of path) {
    if (current && typeof current === 'object' && segment in current) {
      current = current[segment];
    } else {
      // Broken reference found
      return {
        message: `broken reference '${ref}'`,
      };
    }
  }

  // Reference is valid
  return null;
}

