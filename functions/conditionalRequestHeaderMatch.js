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
 * Checks targetVal has corresponding conditional request and response header.
 * @param {string} targetVal The string to lint
 */
module.exports = function (targetVal) {
  if (typeof targetVal !== 'object') {
    return;
  }

  let successResponse = {};

  for (const code in targetVal.responses) {
    if (code.startsWith('2')) {
      successResponse = targetVal.responses[code];
      break;
    }
  }

  if (successResponse.headers == null) {
    return [];
  }

  const resHeaders = [];

  for (const header in successResponse.headers) {
    if (Object.values(pairs).includes(header)) {
      resHeaders.push(header);
    }
  }

  if (targetVal.parameters == null) {
    return [];
  }

  for (const param of targetVal.parameters) {
    if (param.in === 'header' && pairs[param.name] !== undefined) {
      if (!resHeaders.includes(pairs[param.name])) {
        return [
          {
            message: `${
                pairs[param.name]
              } is missing in response header for conditional request header ${
                param.name
              }: (https://developer.cisco.com/docs/api-insights/#!api-guidelines-analyzer)`,
          },
        ];
      }
    }
  }
};

const pairs = {
  'If-Unmodified-Since': 'Last-Modified',
  'If-Modified-Since': 'Last-Modified',
  'If-Range': 'Last-Modified',
  'If-Match': 'Etag',
};
