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

import getPropertiesOASAgnostic from '../util/getPropertiesOASAgnostic.js';
import getNestedKeyIfExists from '../util/getNestedKeyIfExists.js';
/**
 * Common identifiers used for tracking fields. Might be expanded later.
 */
const commonIdentifiers = [
  'trackingId',
  'code',
];

export default function (input, opts, context) {
  let props = getPropertiesOASAgnostic(input, context);

  if (props) {
    // Check if this api uses a top level key; case insensitive
    props = getNestedKeyIfExists(props);
    // Do a case insensitive comparison.
    const propKeys = Object.keys(props).map((prop) => prop.toLowerCase());

    for (const identifier of commonIdentifiers) {
      if (propKeys.includes(identifier.toLowerCase())) {
        return;
      }
    }
  }

  return [
    {
      message: 'Error representations include an identifier to help with troubleshooting.',
    },
  ];
}
