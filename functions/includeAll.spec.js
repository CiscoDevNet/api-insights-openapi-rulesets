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

import includeAll from './includeAll.js';

describe('includeAll', () => {

  const opts = {
    values: [
      'info',
      'description',
      'title',
    ],
  };

  const targetVal = {
    'info': 'info value',
    'description': 'desc',
    'title': 't',
    'other': 'o',
  };

  test('should pass when include all', () => {
    const res = includeAll(targetVal, opts);

    expect(res).toBeUndefined();
  });

  test('should pass when include values with dot', () => {
    const opts = {
      values: [
        'info.version',
        'title',
      ],
    };

    const targetVal = {
      'info': {
        'version': 'v1',
      },
      'title': 't',
      'other': 'o',
    };
    const res = includeAll(targetVal, opts);

    expect(res).toBeUndefined();
  });

  test('should fail when opts.values do not exist', () => {
    const res = includeAll({}, null);

    expect(res).toEqual([
      {
        message: 'opts.values is required to be an non-empty array.',
      },
    ]);
  });

  test('should fail when field does not include all', () => {
    const targetVal = {
      'description': 'desc',
      'other': 'o',
    };

    const res = includeAll(targetVal, opts);

    expect(res).toEqual([
      {
        message: 'The following values must be included: info,title.',
      },
    ]);
  });
});
