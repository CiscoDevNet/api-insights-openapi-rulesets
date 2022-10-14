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

import noCrudVerbs from './noCrudVerbs.js';
import crudHttpList from '../util/verbs.js';
describe('headOperationsMatchHeadersWithGet', () => {
  test('should detect strings with common CRUD verbs', () => {
    for (let i = 0; i < crudHttpList?.length; i++) {
      const verb = crudHttpList[i];

      expect(noCrudVerbs(`/test/${ verb }`)).toBeTruthy();
      expect(noCrudVerbs(`/test/${ verb }Something`)).toBeTruthy();
      expect(noCrudVerbs(`/test/something${ verb[0].toUpperCase() + verb.slice(1) }`)).toBeTruthy();
    }
  });
  test('should allow paths with no common CRUD verbs', () => {
    expect(noCrudVerbs('/test')).toBeUndefined();
  });
});
