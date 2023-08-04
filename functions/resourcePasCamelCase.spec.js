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

import resourcePasCamelCase from './resourcePasCamelCase';

describe('resourcePasCamelCase', () => {
  test('should discard edge cases', () => {
    let res = resourcePasCamelCase('');

    expect(res).toBeUndefined();

    res = resourcePasCamelCase('/');
    expect(res).toBeUndefined();

    res = resourcePasCamelCase(23);
    expect(res).toBeUndefined();

    res = resourcePasCamelCase(null);
    expect(res).toBeUndefined();

    res = resourcePasCamelCase(undefined);
    expect(res).toBeUndefined();
  });

  test('should pass PasCamelCase', () => {
    let res = resourcePasCamelCase('ThisIsPasCamelCaseIO');

    expect(res).toBeUndefined();

    res = resourcePasCamelCase('thisIsCamelCase');
    expect(res).toBeUndefined();

    res = resourcePasCamelCase('ThisIsPascalCase');
    expect(res).toBeUndefined();
  });

  test('should pass strings that do not start with digits', () => {
    let res = resourcePasCamelCase('lessThan30DaysCount');

    expect(res).toBeUndefined();

    res = resourcePasCamelCase('greaterThan30LessThan60DaysCount');
    expect(res).toBeUndefined();

    res = resourcePasCamelCase('greaterThan60LessThan90DaysCount');
    expect(res).toBeUndefined();

    res = resourcePasCamelCase('greaterThan90DaysCount');
    expect(res).toBeUndefined();
  });

  test('should detect strings starting with digits', () => {
    let res = resourcePasCamelCase('30DaysCount');

    expect(res).toEqual([
      {
        message: '30DaysCount must be PasCamelCase',
      },
    ]);

    res = resourcePasCamelCase('30LessThan60DaysCount');
    expect(res).toEqual([
      {
        message: '30LessThan60DaysCount must be PasCamelCase',
      },
    ]);

    res = resourcePasCamelCase('60LessThan90DaysCount');
    expect(res).toEqual([
      {
        message: '60LessThan90DaysCount must be PasCamelCase',
      },
    ]);

    res = resourcePasCamelCase('90DaysCount');
    expect(res).toEqual([
      {
        message: '90DaysCount must be PasCamelCase',
      },
    ]);
  });

  test('should fail anything that is not PasCamelCase', () => {
    let res = resourcePasCamelCase('THISISALLCAPS');

    expect(res).toEqual([
      {
        message: 'THISISALLCAPS must be PasCamelCase',
      },
    ]);

    res = resourcePasCamelCase('this_is_snake_case');
    expect(res).toEqual([
      {
        message: 'this_is_snake_case must be PasCamelCase',
      },
    ]);

    res = resourcePasCamelCase('THISHastoBePasCamelCase?!1');
    expect(res).toEqual([
      {
        message: 'THISHastoBePasCamelCase?!1 must be PasCamelCase',
      },
    ]);
  });

  test('should pass definitive valid words from git issue', () => {
    expect(resourcePasCamelCase('IOStream')).toBeUndefined();

    expect(resourcePasCamelCase('StreamIO')).toBeUndefined();

    expect(resourcePasCamelCase('deviceSN')).toBeUndefined();

    expect(resourcePasCamelCase('deviceID')).toBeUndefined();

    expect(resourcePasCamelCase('DeviceID')).toBeUndefined();

    expect(resourcePasCamelCase('pathASNs')).toBeUndefined();

    expect(resourcePasCamelCase('dscpCP')).toBeUndefined();

    expect(resourcePasCamelCase('awsVPC')).toBeUndefined();
  });

  test('should detect definitive invalid words from git issue', () => {
    expect(resourcePasCamelCase('snake_case')).toBeTruthy();
  });
});
