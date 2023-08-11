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

import casefoldObjectContainsOne from '../util/casefoldObjectContainsOne.js';
import getPropertiesOASAgnostic from '../util/getPropertiesOASAgnostic.js';
import getNestedKeyIfExists from '../util/getNestedKeyIfExists.js';
const commonMessageKeys = [
  'message',
  'messages',
];

export default function (input, opts, context) {
  let properties = getPropertiesOASAgnostic(input, context);

  // lodash get is not case insensitive, thus cannot use it.
  // Check if this api uses a top level key; case insensitive
  properties = getNestedKeyIfExists(properties);
  // At this stage, if the stage above was successful annd properties is not undefined,
  // then properties variable will store a schema object:
  // https://tools.ietf.org/html/draft-wright-json-schema-00#section-4.5
  // TODO: Add support for "anyOf" and "allOf"

  const errorMessage = casefoldObjectContainsOne(properties, commonMessageKeys);

  // Per 'checkPluralRepresentationFields.js', errorMessage key must be an array if the message key is plural.
  // Simply check here if it's undefined, type is irrelevant for this test.
  if (!errorMessage) {
    return [
      {
        message: 'Error representations include a useful human-readable message.',
      },
    ];
  }
}

