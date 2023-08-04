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
export default function (input) {
  let invalidScheme = false;
  const type = input?.type;

  switch (type) {
    case 'http':
      invalidScheme = input?.scheme !== 'bearer';
      break;
    case 'basic': // oas2
      invalidScheme = true;
      break;
    case 'oauth2': {
      // lazily look at both 'flows' (oas3) and 'flow' (oas2)
      const flows = Object.keys(input?.flows ?? {}).concat(input?.flow);

      invalidScheme = flows.includes('password');
      break;
    }

    case 'openIdConnect': // oas3
    case 'apiKey':
    default:
      invalidScheme = false;
      break;
  }

  if (invalidScheme) {
    return [
      {
        message: 'My API authenticates requests using access tokens; NOT username/passwords.',
      },
    ];
  }
}

