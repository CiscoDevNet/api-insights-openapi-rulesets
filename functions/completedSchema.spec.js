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

import completedSchema from './completedSchema';

describe('completedSchema', () => {

  const targetVal = {
    'required': [
      'id',
      'name',
    ],
    'properties': {
      'id': {
        'type': 'integer',
        'format': 'int64',
      },
      'name': {
        'type': 'string',
      },
      'tag': {
        'type': 'string',
      },
    },
  };

  test('should pass when has non empty schemas', () => {
    const res = completedSchema(targetVal);

    expect(res).toBeUndefined();
  });

  test('should pass when schema type is not object', () => {
    const targetVal = {
      'type': 'string',
    };
    const res = completedSchema(targetVal);

    expect(res).toBeUndefined();
  });

  test('should fail when schema properties is empty', () => {
    const targetVal = {
      'required': [
        'id',
        'name',
      ],
      'properties': {
      },
    };
    const res = completedSchema(targetVal);

    expect(res).toEqual([
      {
        message: 'properties missing for object schema',
      },
    ]);
  });

  test('should fail when schema properties is missing', () => {
    const targetVal = {
      'required': [
        'id',
        'name',
      ],
    };
    const res = completedSchema(targetVal);

    expect(res).toEqual([
      {
        message: 'properties missing for object schema',
      },
    ]);
  });
});
