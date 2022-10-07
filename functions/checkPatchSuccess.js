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

import * as _ from 'lodash';
import getPropertiesOASAgnostic from '../util/getPropertiesOASAgnostic.js';
import getNestedKeyIfExists from '../util/getNestedKeyIfExists.js';
const conjunctionKeys = [
  'allOf',
  'anyOf',
];

export default function (request, _opts, context) {
  const reg = /2\d\d/;
  const { requestBody = {}, responses = {} } = request;
  const clonedResponses = { ...(responses || {}) };
  // check there is only one 2xx response
  const codes = Object.keys(clonedResponses);
  const onlyOne2xx = codes.filter((code) => code.match(reg)).length === 1;
  // openapi v2 does not have requestBody object
  let requestBodySchema = requestBody?.content?.['application/json'] || request?.parameters?.find((element) => element.in === 'body') || requestBody;

  // Optional schema key
  requestBodySchema = requestBodySchema?.schema || requestBodySchema;
  // Check if this api uses a top level key; case insensitive
  let props = getNestedKeyIfExists(getPropertiesOASAgnostic(clonedResponses['200'], context));

  // Props will only have one key by the nature of getNestedKeyIfExists
  // strip this key
  if (props && !conjunctionKeys.includes(Object.keys(props)[0])) {
    props = props[Object.keys(props)[0]];
  }

  // partialRep means the response can contain more fields than the request includes,
  // but all fields in request must be present
  const partialRep = (clonedResponses['200']?.content && _.isMatch(clonedResponses['200']?.content, requestBody?.content) && !_.isEmpty(requestBody?.content))
        || (clonedResponses['200']?.schema && _.isMatch(clonedResponses['200']?.schema, requestBodySchema) && !_.isEmpty(requestBodySchema))
        || (!clonedResponses['200']?.content && !clonedResponses['200']?.schema && !requestBody?.content && _.isEqual(requestBodySchema, {}))
        || _.isEqual(props, requestBodySchema);
    // check for 200 Ok and partial representation
  const validOk = clonedResponses['200'] && partialRep && clonedResponses['200'].description;
  const validNoContent = clonedResponses['204'] && !clonedResponses['204'].content && !clonedResponses['204'].schema
        && clonedResponses['204'].description;

  if (!validOk === !validNoContent || !onlyOne2xx) {
    return [
      {
        message: 'PATCH operations return either \'200 OK\' with full representation or \'204 No Content\'.',
      },
    ];
  }
}
