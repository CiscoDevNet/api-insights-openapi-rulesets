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
function checkKeyDifferences(headResponseHeaders, getResponseHeaders) {
  const missingHeaders = [];

  for (const getResponseHeader of getResponseHeaders) {
    if (!headResponseHeaders.find((head) => head.toLowerCase() === getResponseHeader.toLowerCase())) {
      missingHeaders.push(getResponseHeader);
    }
  }

  return missingHeaders;
}

export default function (input, opts, context) {
  const { path } = context;

  // Must have a GET and a HEAD operation.
  if (!input.get || !input.head) {
    return;
  }

  // Must have a responses block for GET and HEAD.
  if (!input.head.responses || !input.get.responses) {
    return;
  }

  const messages = [];
  const prettyPath = path;

  // Loop through each response code. Each response code is handled individually.
  // The function should not stop once the first error is found. It should keep going
  // until there are no more response codes left.
  for (const responseCode of Object.keys(input.get.responses)) {
    const headResponseCode = input.head.responses[responseCode];
    const getResponseCode = input.get.responses[responseCode];

    // If there is a corresponding response code for head and get.
    // If HEAD is missing a response code, that's OK.
    if (headResponseCode && getResponseCode) {
      // If the GET response code has headers but the HEAD response code does not, flag that.
      if (!headResponseCode.headers && getResponseCode.headers) {
        messages.push({
          message: `The HEAD operation for response code ${ responseCode } is missing a "headers" definition`,
          path: [
            ...prettyPath,
            'head',
            'responses',
            responseCode.toString(),
          ],
        });
        // If both GET and HEAD response codes have headers, compare the individual headers.
      } else if (headResponseCode.headers && getResponseCode.headers) {
        // If HEAD is missing headers that GET has, flag that.
        // If GET is missing headers that HEAD has, that's OK.
        const diff = checkKeyDifferences(Object.keys(headResponseCode.headers), Object.keys(getResponseCode.headers));

        if (diff.length > 0) {
          messages.push({
            /* eslint-disable max-len */
            message: `The following headers are missing from the HEAD operation for response code ${ responseCode }: ${ diff.toString() }`,
            path: [
              ...prettyPath,
              'head',
              'responses',
              responseCode.toString(),
              'headers',
            ],
          });
        }
      }
    }
  }

  if (messages.length > 0) {
    return messages;
  }
}
