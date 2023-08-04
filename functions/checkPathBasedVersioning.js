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
 * Splits the path and runs the regex for each node in the path
 * @param {string} path Endpoint path
 * @param {regex} re Regex for testing the each node in path
 */
function checkPath(re, path) {
  return (path ?? '').split('/').some((path) => re.test(path));
}

export default function (input, opts) {
  const { onlyMajor, specVersion } = opts;
  const re = onlyMajor ? /^v[0-9]+(\.[0-9]*)+/ : /^v[0-9]+/;
  const _checkPath = checkPath.bind(null, re);
  // check if it is oas3. if not, assume oas2
  const defaultVersioning = specVersion === 'oas3'
        // check for oas 3 versioning
        ? input?.servers?.every((server) => {
          // check variables
          const vars = Object.values(server?.variables ?? {});
          const versionInVariables = vars.find((v) => _checkPath(v.default) && (v.enum || []).every((e) => _checkPath(e)));

          // TODO: Possibly make this be an XOR (versionInVariables !== re.test(server.url))
          // since it would be strange to have multiple versions...
          return versionInVariables || _checkPath(server?.url);
        })
        // check for swagger 2 basePath for version
        : _checkPath(input?.basePath);
    // check version in paths
  const paths = Object.keys((input?.paths || {})).every((endpoint) => _checkPath(endpoint));

  // if true, then a version was not found at all
  if (!(defaultVersioning || paths || onlyMajor)) {
    return [
      {
        message: 'API uses path-based versioning.',
      },
    ];
  }

  // if true, then a version with revision numbers were found
  if ((defaultVersioning || paths) && onlyMajor) {
    return [
      {
        message: 'API shows only major version numbers on the path; not the revision numbers.',
      },
    ];
  }
}
