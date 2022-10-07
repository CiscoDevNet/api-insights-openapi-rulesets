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
  isOAS2CollectionResponsePossible, isOAS3CollectionResponsePossible, handleCollectionResponse,
} from '../util/isCollectionResponse.js';
'use strict';
export default function (input, opts, context) {

  return handleCollectionResponse(
    input,
    { ...opts, severity: 1 },
    context,
    isOAS2CollectionResponsePossible,
    isOAS3CollectionResponsePossible,
  );
}
