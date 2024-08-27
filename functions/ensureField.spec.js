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

import ensureField from './ensureField.js';

describe('ensureField', () => {

  const opts = {
    field: 'schema',
  };

  const targetVal = {
    'schema': {
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
    },
    'description': 'desc',
  };

  test('should pass when field exists', () => {
    const res = ensureField(targetVal, opts);

    expect(res).toBeUndefined();
  });

  test('should fail when opts.field does not exist', () => {
    const res = ensureField({}, null);

    expect(res).toEqual([
      {
        message: 'field option is missing',
      },
    ]);
  });

  test('should fail when field does not exist', () => {
    const res = ensureField({}, opts);

    expect(res).toEqual([
      {
        message: 'schema is missing in the object',
      },
    ]);
  });
});
