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

export default function ensureErrorConsistency(targetVal, opts, paths, otherValues) {
  const errors = [];
  const descriptionsMap = {};

  // Traverse the API document to collect descriptions and their paths
  Object.entries(targetVal.paths || {}).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
      if (details.responses) {
        Object.entries(details.responses).forEach(([statusCode, response]) => {
          if (statusCode.startsWith('4') || statusCode.startsWith('5')) {
            const description = response.description;

            if (!descriptionsMap[statusCode]) {
              descriptionsMap[statusCode] = {};
            }

            if (!descriptionsMap[statusCode][description]) {
              descriptionsMap[statusCode][description] = [];
            }

            descriptionsMap[statusCode][description].push(`paths.${ path }.${ method }.responses.${ statusCode }`);
          }
        });
      }
    });
  });

  // Generate errors for inconsistencies
  Object.entries(descriptionsMap).forEach(([statusCode, descriptions]) => {
    if (Object.keys(descriptions).length > 1) { // More than one unique description for this status code
      let allPaths = [];
      const allDescriptions = Object.keys(descriptions);

      Object.values(descriptions).forEach((paths) => {
        allPaths = allPaths.concat(paths);
      });

      errors.push({
        message: `Inconsistent descriptions for status code ${ statusCode }. Found '${ allDescriptions.join("', '") }'.`,
        // path: allPaths[0].split('.')
      });
    }
  });

  return errors;
}
