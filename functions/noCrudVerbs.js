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

import crudHttpList from '../util/verbs.js';
export default function (input) {
  const re = /([a-z][a-z0-9]*|[A-Z][a-z0-9]+|[A-Z0-9](?:[A-Z0-9]))/g;
  const paths = input.split('/').filter((val) => val);
  // just tag names that start with a CRUD verb
  const foundVerb = crudHttpList
  .find((verb) => paths.find((node) => node.match(re).some((word) => word.toLowerCase() === verb)));

  if (foundVerb) {
    return [
      {
        message: 'Standard CRUD lifecycle operations map to HTTP verbs; Functional resources are used when non-standard CRUD are needed.',
      },
    ];
  }
}
