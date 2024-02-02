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

import defaultInEnum from './defaultInEnum.js';

describe('defaultInEnum', () => {
  const targetVal = {
    'port': {
      'enum': [
        8443,
        443,
      ],
      'default': 8443,
    },
  };

  test('should pass when default in enum', () => {
    const res = defaultInEnum(targetVal);

    expect(res).toEqual([]);
  });


  test('should pass if no default field in enum', () => {
    const targetVal = {
      'port': {
        'enum': [
          8443,
          443,
        ],
      },
    };

    const res = defaultInEnum(targetVal);

    expect(res).toEqual([]);
  });

  test('should fail if default in not in enum', () => {
    const targetVal = {
      'port': {
        'enum': [
          8443,
          443,
        ],
        'default': 1443,
      },
    };

    const res = defaultInEnum(targetVal);

    expect(res).toEqual([
      {
        message: 'default not in enum',
      },
    ]);
  });

});
