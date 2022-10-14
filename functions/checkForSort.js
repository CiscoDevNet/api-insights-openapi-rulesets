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

import {
  isOAS2CollectionResponse, isOAS3CollectionResponse,
} from '../util/isCollectionResponse.js';

'use strict';
export default function (input, opts, context) {

  const responseCode = input?.responses?.['200'];
  let isCollectionResponse = false;

  if (Array.from(context.rule.formats)[0].displayName === 'OpenAPI 2.0 (Swagger)') {
    isCollectionResponse = isOAS2CollectionResponse(responseCode);
  } else {
    isCollectionResponse = isOAS3CollectionResponse(responseCode);
  }

  if (isCollectionResponse) {
    const sortParam = input.parameters?.find((element) => element.name === 'sort' && element.in === 'query');

    if (!sortParam) {
      return [
        {
          message: 'It is recommended to add a "sort" query parameter to sort this collection',
        },
      ];
    }
  }
}
