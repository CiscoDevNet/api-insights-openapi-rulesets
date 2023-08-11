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
 * Determines if an OAS3 response has a collection (not confident)
 * @param {*} responseCode from excution
 * @returns {Boolean} not confident that there is a collection
 */
function isOAS3CollectionResponsePossible(responseCode) {
  const content = responseCode?.content;

  if (content) {
    // Loop through each content type for the 200 response.
    for (const contentType of Object.values(content)) {
      if (contentType?.schema?.type === 'array') {
        return true;
      }

      // If the response returns an object, loop through each first level child.
      if (contentType?.schema?.type === 'object' && contentType?.schema?.properties) {
        for (const firstLevelChild of Object.values(contentType.schema.properties)) {
          // If a first level child is an array, we are working with a collection.
          if (firstLevelChild?.type === 'array') {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * Determines if an OAS3 response has a collection
 * @param {*} responseCode from excution
 * @returns {Boolean} confident that there is a collection
 */
function isOAS3CollectionResponseLikely(responseCode) {
  const content = responseCode?.content;

  if (content) {
    // Loop through each content type for the 200 response.
    for (const contentType of Object.values(content)) {
      // If the response returns an array immediately, we are working with a collection.
      if (contentType?.schema?.type === 'array') {
        return true;
      }

      // If the response returns an object, loop through each first level child.
      if (contentType?.schema?.type === 'object' && contentType?.schema?.properties) {
        const childObjects = Object.entries(contentType.schema.properties);
        const firstLevelChildArrays = childObjects.filter(([, value]) => value?.type === 'array');

        if (firstLevelChildArrays.length === 1) {
          return true;
        }

        const itemsArray = childObjects.filter(([key]) => key === 'items');

        if (itemsArray.length > 0) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * Determines if an OAS2 response has a collection
 * @param {*} responseCode from excution
 * @returns {Boolean} confident that there is a collection
 */
function isOAS2CollectionResponseLikely(responseCode) {
  // If the response returns an array immediately, we are working with a collection.
  if (responseCode?.schema?.type === 'array') {
    return true;
  }

  // If the response returns an object, loop through each first level child.
  if (responseCode?.schema?.type === 'object' && responseCode?.schema?.properties) {
    const childObjects = Object.entries(responseCode.schema.properties);
    const firstLevelChildArrays = childObjects.filter(([, value]) => value?.type === 'array');

    if (firstLevelChildArrays.length === 1) {
      return true;
    }

    const itemsArray = childObjects.filter(([key]) => key === 'items');

    if (itemsArray.length > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Determines if an OAS2 response has a collection (not confident)
 * @param {*} responseCode from excution
 * @returns {Boolean} not confident that there is a collection
 */
function isOAS2CollectionResponsePossible(responseCode) {
  if (responseCode?.schema?.type === 'array') {
    return true;
  }

  // If the response returns an object, loop through each first level child.
  if (responseCode?.schema?.type === 'object' && responseCode?.schema?.properties) {
    for (const firstLevelChild of Object.values(responseCode.schema.properties)) {
      // If a first level child is an array, we are working with a collection.
      if (firstLevelChild?.type === 'array') {
        return true;
      }
    }
  }

  return false;
}

/**
 * If a given endpoint has a 200 response that returns a collection, then
 * check for a max query parameter and Link header in the response.
 * @param {*} input Spec to examine
 * @param {*} opts Options passed in by ruleset
 * @param {*} paths Paths that are being linted
 * @param {*} otherValues Other diagnostic values given by spectral
 * @param {Function} isOAS2Collection Function to determine if the item is a collection or not
 * @param {Function} isOAS3Collection Function to determine if the item is a collection or not
 * @returns Any linter comments on the spec. Undefined if there are none.
 */
function handleCollectionResponse(input, opts, context, isOAS2Collection, isOAS3Collection) {
  const responseCode = input?.responses?.['200'];
  const messages = [];
  const { path: prettyPath } = context;
  let isCollectionResponse = false;
  const { severity } = opts;

  const formats = context?.rule?.formats;

  if (formats instanceof Set && Array.from(formats)?.[0].displayName === 'OpenAPI 2.0 (Swagger)') {
    isCollectionResponse = isOAS2Collection(responseCode);
  } else {
    isCollectionResponse = isOAS3Collection(responseCode);
  }

  if (isCollectionResponse) {
    const offsetQueryParameter = input.parameters?.find((element) => element.in === 'query' && element.name === 'offset');
    const maxQueryParameter = input.parameters?.find((element) => element.in === 'query' && element.name === 'max');
    const linkResponseHeader = input.responses['200'].headers?.Link;

    if (!maxQueryParameter) {
      messages.push({
        message: 'When returning a paginated collection, include a "max" query parameter',
        path: [...prettyPath],
      });
    }

    // Only suggest the offset parameter when dealing with warnings
    if (severity === 1 && !offsetQueryParameter) {

      messages.push({
        message: 'When supporting offset-based pagination, operations include a "offset" query parameter',
        path: [...prettyPath],
      });
    }

    if (!linkResponseHeader) {
      messages.push({
        message: 'When returning a paginated collection, include a "Link" header in the response',
        path: [
          ...prettyPath,
          'responses',
          '200',
        ],
      });
    }
  }

  if (messages.length > 0) {
    return messages;
  }
}

function isOAS3CollectionResponse(responseCode) {
  const content = responseCode?.content;

  if (content) {
    // Loop through each content type for the 200 response.
    for (const contentType of Object.values(content)) {
      // If the response returns an array immediately, we are working with a collection.
      if (contentType?.schema?.type === 'array') {
        return true;
      }

      // If the response returns an object, loop through each first level child.
      if (contentType?.schema?.type === 'object' && contentType?.schema?.properties) {
        for (const firstLevelChild of Object.values(contentType.schema.properties)) {
          // If a first level child is an array, we are working with a collection.
          if (firstLevelChild?.type === 'array') {
            return true;
          }
        }
      }
    }
  }

  return false;
}

function isOAS2CollectionResponse(responseCode) {
  // If the response returns an array immediately, we are working with a collection.
  if (responseCode?.schema?.type === 'array') {
    return true;
  }

  // If the response returns an object, loop through each first level child.
  if (responseCode?.schema?.type === 'object' && responseCode?.schema?.properties) {
    for (const firstLevelChild of Object.values(responseCode.schema.properties)) {
      // If a first level child is an array, we are working with a collection.
      if (firstLevelChild?.type === 'array') {
        return true;
      }
    }
  }

  return false;
}

export { isOAS2CollectionResponse };
export { isOAS3CollectionResponse };
export { isOAS2CollectionResponsePossible };
export { isOAS2CollectionResponseLikely };
export { isOAS3CollectionResponseLikely };
export { isOAS3CollectionResponsePossible };
export { handleCollectionResponse };
export default {
  isOAS2CollectionResponse,
  isOAS3CollectionResponse,
  isOAS2CollectionResponsePossible,
  isOAS2CollectionResponseLikely,
  isOAS3CollectionResponseLikely,
  isOAS3CollectionResponsePossible,
  handleCollectionResponse,
};
